import {
  Args,
  Context,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { RequestsService } from './requests.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import {
  CreateRequestInput,
  UpdateRequestInput,
} from './dto/create-request.input';
import {
  RequestCreateResponse,
  RequestResponseForList,
} from './entities/request.entity';
import { UpdateAssigneesInput } from './dto/update-assignees.input';
import {
  RequestComment,
  RequestDetail,
  RequestOutput,
  RequestSubtask,
} from './dto/request-detail.output';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { PERMISSIONS } from 'src/auth/permissions.constants';
import { UpdateRequestFieldsInput } from './dto/update-request-fields.input';
import { ServiceUsage } from './dto/service-usage.output';
@Resolver()
export class RequestsResolver {
  constructor(private readonly requestsService: RequestsService) {}

  @Mutation(() => RequestCreateResponse)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.CREATE_REQUESTS)
  async createRequest(
    @Args('input') input: CreateRequestInput,
    @Context('req') req,
  ) {
    const actorId = req.user.sub;
    const isAdmin = ['admin'].includes(req.user.role);
    let createdBy = actorId;
    if (isAdmin && input.asUserId) {
      createdBy = input.asUserId;
    }
    return this.requestsService.createRequest(input, createdBy);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.EDIT_REQUESTS) // Ajusta el permiso según tus constantes
  async updateRequest(
    @Args('requestId', { type: () => String }) requestId: string,
    @Args('input') input: UpdateRequestInput,
    @Context('req') req: any,
  ): Promise<string> {
    const userId = req.user.sub;
    return this.requestsService.updateRequest(requestId, input, userId);
  }

  @Query(() => [RequestResponseForList], { name: 'requestsListForInternal' })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.VIEW_INTERNAL_REQUESTS)
  async requestsListForInternal(
    @Context('req') req: any,
    @Args('status', { type: () => String, nullable: true }) status?: string,
  ): Promise<RequestResponseForList[]> {
    const userId = req.user.sub;
    const role = req.user.role; // Obtener el rol del usuario
    const requests = await this.requestsService.findRequestsForInternal(
      userId,
      role,
      status,
    );
    return requests.map(
      (r): RequestResponseForList => ({
        id: r._id.toString(),
        title: r.title,
        createdAt: r.createdAt.toISOString(),
        category: r.service?.title ?? '',
        client: r.workspaceInfo?.companyName || r.workspaceInfo?.name || '', // Aquí traes el campo correcto
        dueDate: r.dueDate.toISOString(),
        parentRequest: r.parentRequest ? r.parentRequest.toString() : null,
        commentsCount: r.commentsCount,
        credits: r.credits,
        attachmentsCount: r.attachmentsCount,
        subtasksCount: r.subtasksCount,
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

  @Query(() => [RequestResponseForList], { name: 'getRequestList' })
  @UseGuards(GqlAuthGuard)
  async getRequestList(
    @Context('req') req: any,
    @Args('status', { type: () => String, nullable: true }) status?: string,
  ): Promise<RequestResponseForList[]> {
    const userId = req.user.sub;
    return await this.requestsService.findAllWithAssignees(userId, status);
  }

  @Query(() => [RequestResponseForList], {
    name: 'getRequestListByAdmin',
  })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.MANAGE_REQUESTS)
  async getRequestListByAdmin(
    @Args('userClientId', { type: () => String }) userClientId: string,
    @Args('status', { type: () => String, nullable: true }) status?: string,
  ): Promise<RequestResponseForList[]> {
    return await this.requestsService.findAllWithAssignees(
      userClientId,
      status,
    );
  }

  @Mutation(() => String, { name: 'updateRequestAssignees' })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USER_ASSIGNMENTS)
  async updateRequestAssignees(
    @Args('input') input: UpdateAssigneesInput,
  ): Promise<string> {
    const { requestId, assignees } = input;
    return this.requestsService.updateAssignees(requestId, assignees);
  }

  /**
   * GraphQL Query para obtener el detalle completo de una solicitud.
   * Protegido por autenticación.
   * @param id - El ID de la solicitud a obtener.
   * @returns El objeto RequestDetailOutput con todos los datos.
   */
  @Query(() => RequestDetail, { name: 'requestDetail' })
  @UseGuards(GqlAuthGuard)
  getRequestDetail(
    @Args('id', { type: () => String }) id: string,
  ): Promise<RequestDetail> {
    return this.requestsService.getRequestDetail(id);
  }

  @Query(() => [RequestSubtask], { name: 'getSubtasksByRequest' })
  @UseGuards(GqlAuthGuard)
  async getSubtasksByRequest(
    @Args('id', { type: () => String }) id: string,
  ): Promise<RequestSubtask[]> {
    return this.requestsService.getSubtasksByRequest(id);
  }

  @Query(() => [ServiceUsage], { name: 'topServicesByWorkspace' })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.MANAGE_SERVICES)
  async topServicesByWorkspace(
    @Args('workspaceId', { type: () => String }) workspaceId: string,
    @Args('limit', { type: () => Int, nullable: true }) limit = 10,
  ): Promise<ServiceUsage[]> {
    return this.requestsService.getTopServicesByWorkspace(workspaceId, limit);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.EDIT_REQUESTS)
  async updateRequestFields(
    @Args('input') input: UpdateRequestFieldsInput,
    @Context('req') req: any,
  ): Promise<string> {
    const userId = req.user.sub;
    return this.requestsService.updateRequestFields(input, userId);
  }

  //deleteRequest
  @Mutation(() => String)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.EDIT_REQUESTS)
  async deleteRequest(
    @Args('id', { type: () => String }) id: string,
    @Context('req') req: any,
  ): Promise<string> {
    const userId = req.user.sub;
    return this.requestsService.deleteRequest(id, userId);
  }

  //findRequestById
  @Query(() => RequestOutput, { name: 'findRequestById' })
  @UseGuards(GqlAuthGuard)
  async findRequestById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<RequestOutput> {
    return this.requestsService.findRequestById(id);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard) // Asegúrate de proteger la mutación
  async archiveRequest(
    @Args('id', { type: () => ID }) id: string,
    @Context('req') req: any,
  ): Promise<string> {
    const userId = req.user.sub;
    const result = await this.requestsService.archive(id, userId);
    return typeof result === 'string'
      ? result
      : 'Request archived successfully';
  }
}
