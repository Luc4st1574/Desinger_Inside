// src/services/services.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ServicesService } from './services.service';
import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { PERMISSIONS } from 'src/auth/permissions.constants';
import { Permissions } from 'src/auth/permissions.decorator';
import { ServiceCategoryType, ServiceType } from './dto/service-category.type';

@Resolver(() => ServiceType)
export class ServicesResolver {
  constructor(private readonly servicesService: ServicesService) {}

  @Mutation(() => ServiceType)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.CREATE_SERVICES)
  async createService(@Args('input') input: CreateServiceInput) {
    return this.servicesService.create(input);
  }

  @Query(() => [ServiceType])
  @UseGuards(GqlAuthGuard)
  async services() {
    return this.servicesService.findAll();
  }

  @Query(() => ServiceType)
  @UseGuards(GqlAuthGuard)
  async service(@Args('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Mutation(() => ServiceType)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.EDIT_SERVICES)
  async updateService(@Args('input') input: UpdateServiceInput) {
    return this.servicesService.update(input.id, input);
  }

  @Mutation(() => ServiceType)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.DELETE_SERVICES)
  async removeService(@Args('id') id: string) {
    return this.servicesService.remove(id);
  }

  @Mutation(() => ServiceCategoryType)
  async createServiceCategory(
    @Args('name') name: string,
    @Args('description', { nullable: true }) description?: string,
  ) {
    return this.servicesService.createCategory({ name, description });
  }

  @Query(() => [ServiceCategoryType])
  async serviceCategories() {
    return this.servicesService.findAllCategories();
  }
}
