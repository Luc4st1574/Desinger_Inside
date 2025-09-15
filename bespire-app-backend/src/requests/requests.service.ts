/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from './schema/request.schema';
import { Model, Types } from 'mongoose';
import {
  CreateRequestInput,
  UpdateRequestInput,
} from './dto/create-request.input';
import { ServicesService } from 'src/services/services.service';
import { UsersService } from 'src/users/users.service';
import { PlansService } from 'src/plans/plans.service';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { FilesService } from 'src/files/files.service';
import { ActivityService } from 'src/activity/activity.service';
import { CommentsService } from 'src/comments/comments.service';
import { LinksService } from 'src/links/links.service';
import { AssigneeService } from 'src/assignee/assignee.service';
import { UpdateRequestFieldsInput } from './dto/update-request-fields.input';
import { NotificationsService } from 'src/notifications/notifications.service';
import { RequestResponseForList } from './entities/request.entity';
import {
  RequestVersionService,
  SnapshotData,
} from 'src/request-version/request-version.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private requestModel: Model<Request>,
    private readonly servicesService: ServicesService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly plansService: PlansService,
    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService,
    private readonly filesService: FilesService,
    private readonly activityService: ActivityService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
    @Inject(forwardRef(() => AssigneeService))
    private readonly assigneesService: AssigneeService, // Asegúrate de importar el servicio de Assignees
    private readonly linksService: LinksService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    private readonly requestVersionService: RequestVersionService,
  ) {}
  async createRequest(
    input: CreateRequestInput,
    user_id: string,
  ): Promise<Request> {
    console.log('Creating request with input:', input);
    // Transformaciones y defaults
    const {
      title,
      details,
      brand,
      service,
      dueDate,
      priority = 'medium',
      links = [],
      attachments = [],
    } = input;

    const session = await this.requestModel.db.startSession();
    session.startTransaction();
    try {
      //validaciones
      //verificar que tengo creditos suficientes
      const workspace = await this.workspaceService.getWorkspaceById(
        input.workspace,
      );
      if (!workspace) {
        throw new NotFoundException('Workspace not found');
      }
      const user = await this.usersService.findById(user_id);
      if (!user) {
        throw new Error('User not found');
      }
      //@ts-ignore
      if (!workspace.credits || workspace.credits <= 0) {
        throw new Error('Insufficient credits');
      }
      const serviceDetails = await this.servicesService.findOne(service);
      if (!serviceDetails) {
        throw new Error('Service not found');
      }
      if (serviceDetails.status !== 'active') {
        throw new Error('Service is not active');
      }
      const creditsService = serviceDetails.credits;

      //@ts-ignore
      if (workspace.credits < creditsService) {
        throw new Error('Insufficient credits for this service');
      }

      const planDb = await this.plansService.findOne({
        _id: new Types.ObjectId(workspace.plan),
      });
      if (!planDb) throw new Error('Invalid plan');

      const activeOrdersAllowed = planDb.activeOrdersAllowed || 0;
      //const activeOrdersAllowed = 10; // Cambiar por el valor real del plan
      const activeRequestsCount = await this.requestModel.countDocuments({
        createdBy: new Types.ObjectId(user_id),
        status: {
          $in: [
            'queued',
            'in_progress',
            'for_review',
            'for_approval',
            'revision',
            'needs_info',
          ],
        }, // Considerar solo solicitudes activas
      });
      if (activeRequestsCount >= activeOrdersAllowed) {
        throw new Error(
          `You have reached the limit of active requests for your plan (${activeOrdersAllowed}). Please complete or cancel some requests before creating new ones.`,
        );
      }
      //validaciones

      //crear request
      const [req] = await this.requestModel.create(
        [
          {
            title,
            details,
            brand: new Types.ObjectId(brand),
            service: new Types.ObjectId(service),
            createdBy: new Types.ObjectId(user_id),
            status: 'queued', ///default
            priority: (priority || 'medium').toLowerCase(),
            dueDate: dueDate ? new Date(dueDate) : null,
            credits: creditsService,
            workspace: new Types.ObjectId(input.workspace),
            parentRequest: input.parentRequest
              ? new Types.ObjectId(input.parentRequest)
              : null, // Si es un subtask, asignar el parentRequest
          },
        ],
        { session },
      );

      // Guardar cada link en la nueva colección (en paralelo)
      await Promise.all(
        links.map(async (link) => {
          // Ajusta aquí si tu DTO de link es distinto
          return this.linksService.create(
            {
              url: link.url,
              title: link.title,
              favicon: link.favicon,
              linkedToId: req._id.toString(),
              linkedToType: 'request',
            },
            user_id,
          );
        }),
      );
      //ahora recorrer los attachments y actualizarlos
      await Promise.all(
        attachments.map(async (attachment) => {
          return this.filesService.updateFile(
            attachment.fileId,
            {
              linkedToId: req._id.toString(),
              linkedToType: 'request',
              status: 'linked',
            },
            null,
            session,
          );
        }),
      );

      //necesito notificar al admin , al success manager asignado y al mismo que creó el request

      const adminId = await this.usersService.findAdminId();
      const adminObjectId = new Types.ObjectId(adminId);
      const successManagerId = workspace.successManager || null;

      // Crea la notificación
      await this.notificationsService.notify(
        {
          users: [adminObjectId, successManagerId, new Types.ObjectId(user_id)],
          type: 'request_submitted',
          category: 'request',
          linkedToId: req._id as Types.ObjectId,
        },
        session,
      );
      // Actualizar créditos del usuario
      await this.workspaceService.findByIdAndUpdate(
        input.workspace,
        {
          //@ts-ignore
          credits: workspace.credits - creditsService, // Restar créditos del usuario
        },
        session,
      );
      const initialSnapshot = {
        title: req.title,
        details: req.details,
        priority: req.priority,
        dueDate: req.dueDate,
        status: req.status,
        brand: req.brand,
        service: req.service,
      };

      await this.requestVersionService.create(
        {
          requestId: new Types.ObjectId(req._id.toString()),
          updatedBy: new Types.ObjectId(user_id),
          actionType: 'creation',
          changedFields: ['Initial Creation'],
          snapshot: initialSnapshot,
        },
        session,
      );
      await session.commitTransaction();
      return req;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async updateRequest(
    requestId: string,
    input: UpdateRequestInput, // Asume un DTO similar a CreateRequestInput, con campos opcionales
    user_id: string,
  ) {
    console.log('Updating request with input:', input);
    const session = await this.requestModel.db.startSession();
    session.startTransaction();

    try {
      // Buscar la solicitud existente
      const existingRequest = await this.requestModel.findById(requestId);
      if (!existingRequest) {
        throw new NotFoundException('Request not found');
      }

      // Validar permisos: el usuario debe ser el creador, admin o assignee
      const user = await this.usersService.findById(user_id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isCreator = existingRequest.createdBy.toString() === user_id;
      const isAdmin = user.role === 'admin';
      const assignees = await this.getAssigneesList(requestId);
      const isAssignee = assignees.includes(user_id);
      if (!isCreator && !isAdmin && !isAssignee) {
        throw new ForbiddenException(
          'You do not have permission to update this request',
        );
      }

      // Extraer campos del input (solo actualizar los proporcionados)
      const {
        title,
        details,
        brand,
        service,
        dueDate,
        priority,
        links = [],
        attachments = [],
      } = input;

      // Validaciones similares a createRequest, pero solo si cambian campos críticos
      let creditsDifference = 0;
      if (service && service !== existingRequest.service.toString()) {
        const newServiceDetails = await this.servicesService.findOne(service);
        if (!newServiceDetails || newServiceDetails.status !== 'active') {
          throw new Error('New service not found or not active');
        }
        const oldServiceDetails = await this.servicesService.findOne(
          existingRequest.service.toString(),
        );
        creditsDifference =
          newServiceDetails.credits - (oldServiceDetails?.credits || 0);

        // Verificar créditos disponibles en el workspace
        const workspace = await this.workspaceService.getWorkspaceById(
          existingRequest.workspace.toString(),
        );
        if (!workspace || workspace.credits < creditsDifference) {
          throw new Error('Insufficient credits for service update');
        }
      }

      // Preparar actualización
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (details !== undefined) updateData.details = details;
      if (brand !== undefined) updateData.brand = new Types.ObjectId(brand);
      if (service !== undefined)
        updateData.service = new Types.ObjectId(service);
      if (dueDate !== undefined)
        updateData.dueDate = dueDate ? new Date(dueDate) : null;
      if (priority !== undefined)
        updateData.priority = (priority || 'medium').toLowerCase();
      if (creditsDifference !== 0)
        updateData.credits = existingRequest.credits + creditsDifference;

      // Actualizar la solicitud
      const updatedRequest = await this.requestModel.findByIdAndUpdate(
        requestId,
        updateData,
        { new: true, session },
      );

      // Manejar links: eliminar existentes y agregar nuevos (o actualizar si prefieres merge)
      if (links.length > 0) {
        await this.linksService.deleteByLinkedToId(requestId, session);
        await Promise.all(
          links.map(async (link) => {
            return this.linksService.create(
              {
                url: link.url,
                title: link.title,
                favicon: link.favicon,
                linkedToId: requestId,
                linkedToType: 'request',
              },
              user_id,
              session,
            );
          }),
        );
      }

      // Manejar attachments: actualizar estado si cambian
      if (attachments.length > 0) {
        await Promise.all(
          attachments.map(async (attachment) => {
            return this.filesService.updateFile(
              attachment.fileId ?? attachment.id,
              {
                linkedToId: requestId,
                linkedToType: 'request',
                status: 'linked',
              },
              null,
              session,
            );
          }),
        );
      }

      // Actualizar créditos del workspace si cambió el servicio
      if (creditsDifference !== 0) {
        await this.workspaceService.findByIdAndUpdate(
          existingRequest.workspace.toString(),
          {
            credits:
              (
                await this.workspaceService.getWorkspaceById(
                  existingRequest.workspace.toString(),
                )
              ).credits - creditsDifference,
          },
          session,
        );
      }

      // Agregar actividad de actualización
      await this.activityService.create(
        {
          action: 'update',
          linkedToId: requestId,
          linkedToType: 'request',
          activityText: `Request "${updatedRequest.title}" updated by ${user.firstName} ${user.lastName}`,
        },
        user_id,
        session,
      );

      // Notificar a interesados (similar a createRequest)
      const adminId = await this.usersService.findAdminId();
      const workspace = await this.workspaceService.getWorkspaceById(
        existingRequest.workspace.toString(),
      );
      const successManagerId = workspace?.successManager || null;
      await this.notificationsService.notify(
        {
          users: [
            new Types.ObjectId(adminId),
            successManagerId,
            new Types.ObjectId(user_id),
          ].filter(Boolean),
          type: 'request_updated',
          category: 'request',
          linkedToId: updatedRequest._id as Types.ObjectId,
        },
        session,
      );

      // 1. Identificar los campos que cambiaron (esta parte es crucial)
      const changedFieldsInfo: { key: string; name: string }[] = [];
      const userFriendlyNames = {
        title: 'Title',
        details: 'Request Details (Description)',
        priority: 'Priority',
        dueDate: 'Date Needed',
        status: 'Status',
        assignees: 'Assignees',
      };

      // Itera sobre las claves que podrían haber cambiado (las del input)
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(userFriendlyNames, key)) {
          const oldValue = existingRequest[key];
          const newValue = input[key];

          // Lógica de comparación mejorada
          let hasChanged = false;
          if (oldValue instanceof Date || newValue instanceof Date) {
            // Comparación especial para fechas
            if (new Date(oldValue).getTime() !== new Date(newValue).getTime()) {
              hasChanged = true;
            }
          } else if (String(oldValue) !== String(newValue)) {
            // Comparación general
            hasChanged = true;
          }

          if (hasChanged) {
            changedFieldsInfo.push({ key: key, name: userFriendlyNames[key] });
          }
        }
      }

      if (changedFieldsInfo.length > 0) {
        const snapshotData: Partial<SnapshotData> = {}; // Usa Partial para indicar que no todos los campos estarán

        for (const field of changedFieldsInfo) {
          snapshotData[field.key] = updatedRequest[field.key];
        }

        await this.requestVersionService.create(
          {
            requestId: new Types.ObjectId(updatedRequest._id.toString()),
            updatedBy: new Types.ObjectId(user_id),
            // El array de nombres amigables para la UI
            changedFields: changedFieldsInfo.map((f) => f.name),
            actionType: 'update',
            // El objeto que contiene solo los datos de los campos que cambiaron
            snapshot: snapshotData,
          },
          session,
        );
      }
      await session.commitTransaction();
      return 'Request updated successfully';
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async findAllWithAssignees(userId: string, status?: string): Promise<any[]> {
    console.log('Finding all requests for user:', userId);
    // Buscar el usuario
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    let requests = [];
    if (user.role == 'team_member') {
      requests = await this.findRequestsForInternal(
        userId,
        'team_member',
        status,
      );
    } else {
      // Por defecto, cliente: ve solo los requests de su workspace
      const workspaceId = user.workspaceSelected;

      // Función helper para construir el filtro de status
      const getStatusFilter = () => {
        if (status === 'pending') {
          return {
            status: {
              $in: ['revision', 'needs_info', 'for_review', 'for_approval'],
            },
          };
        } else if (status) {
          return { status };
        } else {
          return { status: { $ne: 'cancelled' } };
        }
      };

      requests = await this.requestModel.aggregate([
        {
          $match: {
            workspace: workspaceId,
            archivedAt: null,
            ...getStatusFilter(),
          },
        },
        ...this.getRequestAggregateLookups(),
      ]);
    }

    return requests.map(
      (r): RequestResponseForList => ({
        id: r._id.toString(),
        title: r.title,
        createdAt: r.createdAt.toISOString(),
        category: r.service?.title ?? '',
        dueDate: r.dueDate.toISOString(),
        parentRequest: r.parentRequest ? r.parentRequest.toString() : null,
        commentsCount: r.commentsCount,
        attachmentsCount: r.attachmentsCount,
        subtasksCount: r.subtasksCount,
        credits: r.credits,
        priority: r.priority,
        status: r.status,
        assignees: r.assignees.map((assignee) => ({
          id: assignee.userId,
          name: assignee.name,
          teamRole: assignee.teamRole ?? null, // Optional field
          avatarUrl: assignee.avatarUrl ?? null, // Optional field
        })),
      }),
    );
  }

  /**
   * Devuelve los servicios más usados en requests por workspace.
   * Retorna lista de objetos con _id (service id) y Type (service title) y count.
   */
  // ...existing code...

  async getTopServicesByWorkspace(workspaceId: string, limit = 10) {
    const workspaceObjId = new Types.ObjectId(workspaceId);
    const pipeline = [
      { $match: { workspace: workspaceObjId } },
      { $group: { _id: '$service', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'services', // Colección de services
          localField: '_id',
          foreignField: '_id',
          as: 'serviceInfo',
        },
      },
      { $unwind: { path: '$serviceInfo', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'servicecategories', // Colección de servicecategories (ajusta si el nombre es diferente)
          localField: 'serviceInfo.category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: '$_id',
          Type: '$categoryInfo.name', // Ahora usa el name de la categoría
          count: 1,
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ];

    const results: any[] = await this.requestModel.aggregate(pipeline as any[]);
    // Mapear para asegurar que _id sea string
    return results.map((r) => ({
      _id: r._id?.toString?.() || r._id,
      Type: r.Type || '',
      count: r.count || 0,
    }));
  }

  // ...existing code...

  // Modulariza tu pipeline de lookups aquí
  getRequestAggregateLookups(): any[] {
    return [
      // Traer assignees (colección generalizada)
      {
        $lookup: {
          from: 'assignees',
          let: { requestId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$linkedToId', '$$requestId'] },
                    { $eq: ['$linkedToType', 'request'] },
                  ],
                },
              },
            },
            // Traer info del user asignado
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userInfo',
              },
            },
            {
              $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: false },
            },
            {
              $project: {
                _id: 1,
                userId: '$userInfo._id',
                name: {
                  $cond: [
                    {
                      $and: [
                        { $ifNull: ['$userInfo.firstName', false] },
                        { $ifNull: ['$userInfo.lastName', false] },
                      ],
                    },
                    {
                      $concat: [
                        '$userInfo.firstName',
                        ' ',
                        '$userInfo.lastName',
                      ],
                    },
                    '$userInfo.email',
                  ],
                },
                avatarUrl: '$userInfo.avatarUrl',
                teamRole: '$userInfo.teamRole',
                email: '$userInfo.email',
                assignedBy: '$assignedBy',
                createdAt: 1,
              },
            },
          ],
          as: 'assignees',
        },
      },
      // Traer servicio
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'service',
        },
      },
      {
        $unwind: { path: '$service', preserveNullAndEmptyArrays: true },
      },
      // Count subtasks
      {
        $lookup: {
          from: 'requests', // Subtasks = requests con parentId = este request
          let: { requestId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$parentRequest', '$$requestId'] } } },
            { $count: 'count' },
          ],
          as: 'subtasksCountArr',
        },
      },
      // Count comments
      {
        $lookup: {
          from: 'comments',
          let: { requestId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$linkedToId', '$$requestId'] } } },
            { $count: 'count' },
          ],
          as: 'commentsCountArr',
        },
      },
      // Count attachments/files
      {
        $lookup: {
          from: 'files',
          let: { requestId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$linkedToId', '$$requestId'] },
                    { $eq: ['$linkedToType', 'request'] },
                    { $eq: ['$type', 'file'] }, // Solo archivos, no carpetas
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'attachmentsCountArr',
        },
      },
      // Aplana los arrays de conteo a números simples
      {
        $addFields: {
          subtasksCount: {
            $ifNull: [{ $arrayElemAt: ['$subtasksCountArr.count', 0] }, 0],
          },
          commentsCount: {
            $ifNull: [{ $arrayElemAt: ['$commentsCountArr.count', 0] }, 0],
          },
          attachmentsCount: {
            $ifNull: [{ $arrayElemAt: ['$attachmentsCountArr.count', 0] }, 0],
          },
        },
      },
      // Limpiar los arrays de conteo temporales
      {
        $project: {
          subtasksCountArr: 0,
          commentsCountArr: 0,
          attachmentsCountArr: 0,
        },
      },
      // Traer workspace info
      {
        $lookup: {
          from: 'workspaces',
          localField: 'workspace',
          foreignField: '_id',
          as: 'workspaceInfo',
        },
      },
      {
        $unwind: { path: '$workspaceInfo', preserveNullAndEmptyArrays: true },
      },
    ];
  }

  // src/requests/requests.service.ts

  async findRequestsForInternal(
    userId: string,
    role: string,
    status?: string,
  ): Promise<any[]> {
    // Buscar el usuario
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Función helper para construir el filtro de status
    const getStatusFilter = () => {
      if (status === 'pending') {
        return {
          status: {
            $in: ['revision', 'needs_info', 'for_review', 'for_approval'],
          },
        };
      } else if (status) {
        return { status };
      } else {
        return { status: { $ne: 'cancelled' } };
      }
    };

    // Si es admin, ve todos los requests (sin filtrar por workspace ni asignado)
    if (user.role === 'admin') {
      return this.requestModel.aggregate([
        { $match: getStatusFilter() },
        ...this.getRequestAggregateLookups(),
      ]);
    }

    // Si es trabajador interno (team_member o isInternalTeam true)
    if (user.role === 'team_member' && role !== 'success_manager') {
      // Buscar requests donde el usuario es assignee
      const assigneeDocs = await this.assigneesService.findAssigneesByUserId(
        userId,
        'request',
      );

      const assignedRequestIds = assigneeDocs.map((a) => a.linkedToId);

      if (!assignedRequestIds.length) return [];

      return this.requestModel.aggregate([
        {
          $match: {
            _id: { $in: assignedRequestIds },
            ...getStatusFilter(),
          },
        },
        ...this.getRequestAggregateLookups(),
      ]);
    }

    // 1. Buscar todos los workspaces donde es successManager
    const userIdObj = new Types.ObjectId(userId);
    const workspaces = await this.workspaceService.find({
      successManager: userIdObj,
    });
    const workspaceIds = workspaces.map((ws) => ws._id);

    // 2. Buscar requests donde es assignee individual
    const assigneeDocs = await this.assigneesService.findAssigneesByUserId(
      userId,
      'request',
    );
    const assignedRequestIds = assigneeDocs.map((a) => a.linkedToId);

    // 3. Buscar todos los requests en esos workspaces + los requests donde es assignee (sin repetir)
    const matchQuery: any = {
      $and: [
        getStatusFilter(),
        {
          $or: [
            { workspace: { $in: workspaceIds } },
            { _id: { $in: assignedRequestIds } },
          ],
        },
      ],
    };

    // 4. Ejecutar el aggregate
    return this.requestModel.aggregate([
      { $match: matchQuery },
      ...this.getRequestAggregateLookups(),
    ]);
  }

  async updateAssignees(
    requestId: string,
    assignees: string[], // Array de IDs de usuarios
  ) {
    const request = await this.requestModel.findById(requestId);
    if (!request) throw new NotFoundException('Request not found');
    //@ts-ignore
    request.assignees = assignees.map((a) => new Types.ObjectId(a));
    await request.save();
    return 'Assignees updated successfully';
  }

  async getRequestDetail(id: string) {
    // 1. Request principal
    const req = await this.requestModel
      .findById(id)
      .populate('workspace', 'name companyImg')
      .populate('createdBy', 'firstName lastName avatarUrl teamRole email')
      .populate({
        path: 'service', // 1. El campo a poblar en el modelo original (Request)
        populate: {
          path: 'category', // 2. El campo a poblar DENTRO del modelo 'service'
          model: 'ServiceCategory', // 3. Es buena práctica ser explícito con el nombre del modelo
        },
      })
      .lean();

    if (!req) throw new NotFoundException('Request not found');

    // 2. Assignees
    const assignees = await this.assigneesService.getAssignees(id, 'request');
    if (!assignees)
      throw new NotFoundException('No assignees found for this request');

    //ahora los links tambien
    const links = await this.linksService.findByLinkedToId(id);

    // 3. Subtasks (Request con parentId = este id)
    const subtasks = await this.requestModel
      .find({ parentRequest: new Types.ObjectId(id) })
      .lean();

    console.log('subtasks de ', id, subtasks);

    // 5. Files/Attachments (linkedToId = requestId, linkedToType = 'request')
    const attachments = await this.filesService.findByLinkedToId(id);

    // 7. Armar respuesta
    // Buscar assignees de los subtasks
    const subtaskAssigneesMap: Record<string, any[]> = {};
    await Promise.all(
      subtasks.map(async (st) => {
        subtaskAssigneesMap[st._id.toString()] =
          await this.assigneesService.getAssignees(
            st._id.toString(),
            'request',
          );
      }),
    );

    return {
      id: req._id.toString(),
      title: req.title,
      details: req.details,
      priority: req.priority,
      status: req.status,
      parentRequest: req.parentRequest ? req.parentRequest.toString() : null,

      client: {
        id: req.workspace?._id?.toString() || '',
        name: (req.workspace as any)?.name || '',
        avatar: (req.workspace as any)?.companyImg || '',
      },
      requester: {
        id: req.createdBy?._id?.toString() || '',
        name:
          (
            ((req.createdBy as any)?.firstName || '') +
            ' ' +
            ((req.createdBy as any)?.lastName || '')
          ).trim() ||
          (req.createdBy as any)?.email ||
          '',
        avatarUrl: (req.createdBy as any)?.avatarUrl || '',
        teamRole: (req.createdBy as any)?.teamRole || '',
      },
      assignees: assignees.map((a) => a.user),
      createdAt: (req.createdAt as any)?.toISOString(),
      dueDate: (req.dueDate as any)?.toISOString() || null,
      internalDueDate: (req.internalDueDate as any)?.toISOString() || null,
      timeSpent: (req.timeSpent as any) ?? { hours: 0, minutes: 0 },
      service: {
        id: (req.service as any)?._id?.toString() || '',
        title: (req.service as any)?.title || '',
        category: {
          id: (req.service as any)?.category?._id?.toString() || '',
          name: (req.service as any)?.category?.name || '',
        },
      },
      credits: req.credits,
      //@ts-ignore
      links: links || [],
      attachments: attachments,
      subtasks: subtasks.map((st) => ({
        id: st._id.toString(),
        title: st.title,
        status: st.status,
        dueDate: st.dueDate ? st.dueDate.toISOString() : null,
        internalDueDate: st.internalDueDate
          ? st.internalDueDate.toISOString()
          : null,
        //@ts-ignore
        assignees: (subtaskAssigneesMap[st._id.toString()] || []).map(
          (a) => a.user,
        ),
      })),
      Brand: req.brand ? req.brand.toString() : null,
    };
  }

  async findRequestById(requestId: string) {
    const req = await this.requestModel
      .findById(requestId)
      .populate({
        path: 'service', // 1. El campo a poblar en el modelo original (Request)
        populate: {
          path: 'category', // 2. El campo a poblar DENTRO del modelo 'service'
          model: 'ServiceCategory', // 3. Es buena práctica ser explícito con el nombre del modelo
        },
      })
      .lean();
    if (!req) throw new NotFoundException('Request not found');
    //ahora los links tambien
    const links = await this.linksService.findByLinkedToId(requestId);

    // 5. Files/Attachments (linkedToId = requestId, linkedToType = 'request')
    const attachments = await this.filesService.findByLinkedToId(requestId);

    return {
      id: req._id.toString(),
      title: req.title,
      details: req.details,
      priority: req.priority,
      status: req.status,
      parentRequest: req.parentRequest ? req.parentRequest.toString() : null,
      workspace: req.workspace ? req.workspace.toString() : null,
      createdAt: (req.createdAt as any)?.toISOString(),
      dueDate: (req.dueDate as any)?.toISOString() || null,
      service: {
        id: (req.service as any)?._id?.toString() || '',
        title: (req.service as any)?.title || '',
        category: {
          id: (req.service as any)?.category?._id?.toString() || '',
          name: (req.service as any)?.category?.name || '',
        },
      },
      //@ts-ignore
      links: links || [],
      attachments: attachments,
      brand: req.brand ? req.brand.toString() : null,
    };
  }

  async getSubtasksByRequest(requestId: string) {
    const subtasks = await this.requestModel
      .find({ parentRequest: new Types.ObjectId(requestId) })
      .lean();

    // Obtener assignees para cada subtask
    const subtaskAssigneesMap: Record<string, any[]> = {};
    await Promise.all(
      subtasks.map(async (st) => {
        subtaskAssigneesMap[st._id.toString()] =
          await this.assigneesService.getAssignees(
            st._id.toString(),
            'request',
          );
      }),
    );

    return subtasks.map((st) => ({
      id: st._id.toString(),
      title: st.title,
      status: st.status,
      dueDate: st.dueDate ? st.dueDate.toISOString() : null,
      assignees: (subtaskAssigneesMap[st._id.toString()] || []).map(
        (a) => a.user,
      ),
    }));
  }

  async updateRequestFields(
    input: UpdateRequestFieldsInput,
    userId: string,
  ): Promise<string> {
    const { requestId, ...fields } = input;

    const session = await this.requestModel.db.startSession();
    session.startTransaction();

    try {
      const existingRequest = await this.requestModel.findById(requestId);
      if (!existingRequest) {
        throw new NotFoundException('Request not found');
      }
      const updated = await this.requestModel.findByIdAndUpdate(
        requestId,
        { $set: fields },
        { new: true, session },
      );
      if (!updated) throw new NotFoundException('Request not found');

      const userObjectId = new Types.ObjectId(userId);
      const requestObjectId = new Types.ObjectId(requestId);

      const changedFieldsInfo: { key: string; name: string }[] = [];
      const userFriendlyNames = {
        title: 'Title',
        details: 'Request Details (Description)',
        priority: 'Priority',
        dueDate: 'Date Needed',
        status: 'Status',
        assignees: 'Assignees',
      };

      // Itera sobre las claves que podrían haber cambiado (las del input)
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(userFriendlyNames, key)) {
          const oldValue = existingRequest[key];
          const newValue = input[key];

          // Lógica de comparación mejorada
          let hasChanged = false;
          if (oldValue instanceof Date || newValue instanceof Date) {
            // Comparación especial para fechas
            if (new Date(oldValue).getTime() !== new Date(newValue).getTime()) {
              hasChanged = true;
            }
          } else if (String(oldValue) !== String(newValue)) {
            // Comparación general
            hasChanged = true;
          }

          if (hasChanged) {
            changedFieldsInfo.push({ key: key, name: userFriendlyNames[key] });
          }
        }
      }

      let actionType = 'update';
      if ('status' in fields) {
        actionType = 'status_change';
        await this.notificationsService.notify(
          {
            users: [userObjectId],
            type: 'request_status_updated',
            category: 'request',
            linkedToId: requestObjectId,
            meta: {
              status: fields.status,
            },
          },
          session,
        );

        if (fields.status === 'completed') {
          await this.requestModel.findByIdAndUpdate(requestId, {
            completedAt: new Date(),
          });
        }
      }

      if (fields.priority) {
        actionType = 'priority_change';
      }

      if (changedFieldsInfo.length > 0) {
        const snapshotData: Partial<SnapshotData> = {}; // Usa Partial para indicar que no todos los campos estarán

        for (const field of changedFieldsInfo) {
          snapshotData[field.key] = updated[field.key];
        }

        await this.requestVersionService.create(
          {
            requestId: new Types.ObjectId(updated._id.toString()),
            updatedBy: new Types.ObjectId(userId),
            // El array de nombres amigables para la UI
            changedFields: changedFieldsInfo.map((f) => f.name),
            actionType: actionType,
            // El objeto que contiene solo los datos de los campos que cambiaron
            snapshot: snapshotData,
          },
          session,
        );
      }
      await session.commitTransaction();
      return 'Request updated successfully';
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async findById(id: string): Promise<Request> {
    const request = await this.requestModel.findById(id);
    if (!request) throw new NotFoundException('Request not found');
    return request;
  }

  async getAverageTimePerRequest(
    workspaceId: string | Types.ObjectId,
  ): Promise<number | null> {
    // Busca solo las requests completadas con ambas fechas
    const requests = await this.requestModel
      .find({
        workspace: new Types.ObjectId(workspaceId),
        status: 'completed',
        completedAt: { $ne: null },
        createdAt: { $ne: null },
      })
      .select('createdAt completedAt')
      .lean();

    if (!requests.length) return null;

    // Calcula el tiempo de cada request en horas
    const timesInHours = requests.map((req) => {
      const start = new Date(req.createdAt).getTime();
      const end = new Date(req.completedAt).getTime();
      return (end - start) / (1000 * 60 * 60); // horas
    });

    // Saca el promedio
    const avgTime =
      timesInHours.reduce((a, b) => a + b, 0) / timesInHours.length;
    // Opcional: Redondear a un decimal
    return Math.round(avgTime * 10) / 10;
  }

  async getRevisionStatsByWorkspace(workspaceId: string | Types.ObjectId) {
    // 1. Busca todos los requests del workspace
    const requests = await this.requestModel
      .find({ workspace: new Types.ObjectId(workspaceId) }, { _id: 1 })
      .lean();
    const requestIds = requests.map((r) => r._id);

    if (requestIds.length === 0) return { avg: 0, data: [] };

    // 2. Busca los activity logs de cambio de status que NO sean "completed"
    const logs = await this.activityService.find({
      linkedToId: { $in: requestIds },
      linkedToType: 'request',
      action: 'update_status',
      'meta.status': { $ne: 'completed' }, // <-- aquí filtras solo los que NO son completed
    });

    // 3. Cuenta cuántas revisiones tiene cada request
    const revisionsPerRequest: Record<string, number> = {};
    logs.forEach((log) => {
      const id = log.linkedToId.toString();
      revisionsPerRequest[id] = (revisionsPerRequest[id] || 0) + 1;
    });

    // 4. Calcula el promedio
    const counts = requestIds.map(
      (id) => revisionsPerRequest[id.toString()] || 0,
    );
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;

    // Opcional: retorna data detallada por request
    return {
      avg, // promedio de revisiones por request en el workspace
      data: counts, // cantidad de revisiones por cada request
      details: revisionsPerRequest, // mapa id->cantidad
    };
  }

  //necesito obtener los assignees de un request
  async getAssigneesList(requestId: string): Promise<string[]> {
    const assignees =
      await this.assigneesService.findAssigneesByLinkedTo(requestId);
    //retornar lista de _id
    // console.log('assignees', assignees);
    return assignees.map((a) => a.user._id.toString());
  }

  async deleteRequest(id: string, userId: string) {
    console.log('delete request ', id, userId);
    //si entre aqui es porque tengo permisos para borrar, por ende lo unico que debo verificar
    //es que si el rol del user no es admin , entonces debo verificar que en el workspace del request
    //sea un admin.
    //primero buscar el user
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const role = user.role;
    if (role !== 'admin') {
      // Verificar que en el workspace del request haya un admin
      const request = await this.requestModel.findById(id);
      if (!request) throw new NotFoundException('Request not found');

      const workspaceAdmins = await this.workspaceService.findAdminsByWorkspace(
        request.workspace.toString(),
      );
      if (!workspaceAdmins.length) {
        throw new ForbiddenException('No admin user in workspace');
      }
      //verificar que este user sea uno de los admin
      const isAdmin = workspaceAdmins.some((admin) =>
        (admin._id as Types.ObjectId).equals(user._id as Types.ObjectId),
      );
      if (!isAdmin) {
        throw new ForbiddenException('User is not an admin in workspace');
      }
    }
    //ahora que todo esta bien validado entonces si a borrar el request
    await this.requestModel.findByIdAndDelete(id);
    return 'Request deleted successfully';
  }

  async archive(id: string, userId: string) {
    const session = await this.requestModel.db.startSession();
    session.startTransaction();

    try {
      const requestToArchive = await this.requestModel
        .findById(id)
        .session(session);
      if (!requestToArchive) {
        throw new NotFoundException(`Request with ID "${id}" not found.`);
      }
      if (requestToArchive.archivedAt) {
        // Es idempotente, si ya está archivado, simplemente lo devolvemos.
        await session.abortTransaction();
        return requestToArchive;
      }

      // Actualiza el campo para marcarlo como archivado
      requestToArchive.archivedAt = new Date();
      const archivedRequest = await requestToArchive.save({ session });

      // CREAR UNA VERSIÓN PARA EL HISTORIAL
      // El "snapshot" no cambia, pero el evento es importante.
      await this.requestVersionService.create(
        {
          requestId: new Types.ObjectId(archivedRequest._id.toString()),
          updatedBy: new Types.ObjectId(userId),
          changedFields: ['Archived'], // Un campo especial para este evento
          snapshot: {
            // El estado final del request
            title: archivedRequest.title,
            details: archivedRequest.details,
            // ... copia los demás campos del snapshot
          },
          actionType: 'archived',
        },
        session,
      );

      await session.commitTransaction();
      return 'Request archived successfully';
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
