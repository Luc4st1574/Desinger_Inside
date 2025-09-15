import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { PlansService } from './plans.service';
import { Plan } from './entities/plan.entity';
import { CreatePlanInput } from './dto/create-plan.input';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { PERMISSIONS } from 'src/auth/permissions.constants';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Permissions } from 'src/auth/permissions.decorator';
import { UpdatePlanInput } from './dto/update-plan.input';

@Resolver(() => Plan)
export class PlansResolver {
  constructor(private readonly plansService: PlansService) {}

  @Mutation(() => Plan)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.MANAGE_PLAN)
  createPlan(@Args('createPlanInput') createPlanInput: CreatePlanInput) {
    return this.plansService.create(createPlanInput);
  }

  @Mutation(() => Plan)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.MANAGE_PLAN)
  async updatePlan(@Args('updatePlanInput') updatePlanInput: UpdatePlanInput) {
    return this.plansService.update(updatePlanInput);
  }

  @Query(() => [Plan], { name: 'findAllPlans' })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.MANAGE_PLAN) // O un permiso más amplio si es necesario
  async findAllPlans() {
    return this.plansService.findAll();
  }

  @Query(() => Plan, { name: 'findPlanById' })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.MANAGE_PLAN) // O un permiso más amplio si es necesario
  async findPlanById(@Args('id', { type: () => ID }) id: string) {
    return this.plansService.getPlanById(id);
  }

  //delete
  @Mutation(() => Plan)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.MANAGE_PLAN)
  async removePlan(@Args('id', { type: () => ID }) id: string) {
    return this.plansService.remove(id);
  }
}
