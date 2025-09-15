import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RequestVersion } from './schema/request-version.schema';
import { ClientSession, Model, Types } from 'mongoose';
import { RequestVersionOut } from './dto/request-version.dto';

export interface SnapshotData {
  title?: string;
  details?: string;
  priority?: string;
  status?: string;
  dueDate?: Date;
  internalDueDate?: Date;
  assignees?: Types.ObjectId[];
  brand?: Types.ObjectId;
  service?: Types.ObjectId;
}

@Injectable()
export class RequestVersionService {
  @InjectModel(RequestVersion.name)
  private requestVersionModel: Model<RequestVersion>;

  /**
   * Crea una nueva versión (snapshot) de un request.
   * Diseñado para ser llamado desde dentro de una transacción.
   */
  async create(
    data: {
      requestId: Types.ObjectId;
      updatedBy: Types.ObjectId;
      actionType: string; // <-- Nuevo parámetro
      changedFields: string[];
      snapshot: SnapshotData;
      linkedDocumentId?: Types.ObjectId; // <-- Nuevo parámetro
    },
    session?: ClientSession, // Acepta una sesión para participar en transacciones
  ): Promise<RequestVersion> {
    const [createdVersion] = await this.requestVersionModel.create(
      [
        {
          // create espera un array para funcionar con sesiones
          request: data.requestId,
          updatedBy: data.updatedBy,
          actionType: data.actionType,
          changedFields: data.changedFields,
          snapshot: data.snapshot,
          linkedDocumentId: data.linkedDocumentId,
        },
      ],
      { session }, // Pasa la sesión a la operación de la base de datos
    );
    return createdVersion;
  }

  /**
   * Encuentra todo el historial de versiones para un request específico.
   */
  async findByRequestId(requestId: string) {
    const requestVersions = await this.requestVersionModel.aggregate([
      { $match: { request: new Types.ObjectId(requestId) } },
      {
        $lookup: {
          from: 'users', // Colección de usuarios
          localField: 'updatedBy',
          foreignField: '_id',
          as: 'updatedBy',
          pipeline: [{ $project: { firstName: 1, lastName: 1, avatarUrl: 1 } }],
        },
      },
      { $unwind: { path: '$updatedBy', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users', // Colección de usuarios para assignees (ajusta si es diferente)
          localField: 'snapshot.assignees',
          foreignField: '_id',
          as: 'snapshot.assignees',
          pipeline: [{ $project: { firstName: 1, lastName: 1, avatarUrl: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'brands', // Colección de brands (ajusta el nombre si es diferente)
          localField: 'snapshot.brand',
          foreignField: '_id',
          as: 'snapshot.brand',
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $unwind: { path: '$snapshot.brand', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'services', // Colección de services (ajusta el nombre si es diferente)
          localField: 'snapshot.service',
          foreignField: '_id',
          as: 'snapshot.service',
          pipeline: [{ $project: { title: 1 } }],
        },
      },
      {
        $unwind: {
          path: '$snapshot.service',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    //  console.log('requestVersions', requestVersions);
    //crear retorno de objeto personalizado.
    console.log(requestVersions[0].snapshot?.assignees);
    const response = requestVersions.map((version) => ({
      id: version._id?.toString() || null,
      request: version.request?.toString() || null,
      updatedBy: version.updatedBy
        ? {
            firstName: (version.updatedBy as any).firstName || null,
            lastName: (version.updatedBy as any).lastName || null,
            avatarUrl: (version.updatedBy as any).avatarUrl || null,
          }
        : null,
      changedFields: version.changedFields || [],
      snapshot: {
        title: version.snapshot?.title || null,
        details: version.snapshot?.details || null,
        priority: version.snapshot?.priority || null,
        status: version.snapshot?.status || null,
        dueDate: version.snapshot?.dueDate || null,
        internalDueDate: version.snapshot?.internalDueDate || null,
        assignees:
          version.snapshot?.assignees?.map((assignee) => ({
            id: assignee?._id?.toString() || null,
            firstName: (assignee as any)?.firstName || null,
            lastName: (assignee as any)?.lastName || null,
            avatarUrl: (assignee as any)?.avatarUrl || null,
          })) || null,
        brand: (version.snapshot?.brand as any)?.name || null,
        service: (version.snapshot?.service as any)?.title || null,
      },
      actionType: version.actionType || null,
      createdAt: (version as any).createdAt || null,
    }));
    // console.log('response', response);
    return response;
  }
}
