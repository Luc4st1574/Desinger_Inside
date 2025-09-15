import { Args, Context, Mutation, Query, Resolver, ID } from '@nestjs/graphql';
import { FeedbackService } from './feedback.service';
import { FeedbackEntity } from './entities/feedback.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CreateFeedbackInput } from './dto/create-feedback.input';
import { UpdateFeedbackInput } from './dto/update-feedback.input';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { PERMISSIONS } from 'src/auth/permissions.constants';
import { FeedbackCategoryService } from './feedback-category.service';
import { FeedbackCategoryEntity } from './entities/feedback-category.entity';
import {
  CreateFeedbackCategoryInput,
  UpdateFeedbackCategoryInput,
} from './dto/feedback-category.input';

@Resolver(() => FeedbackEntity)
export class FeedbackResolver {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly feedbackCategoryService: FeedbackCategoryService,
  ) {}

  // Feedback CRUD
  @Mutation(() => FeedbackEntity)
  @UseGuards(GqlAuthGuard)
  async createFeedback(
    @Args('input') input: CreateFeedbackInput,
    @Context('req') req: any,
  ) {
    const userId = req.user.sub;
    return this.feedbackService.create(userId, input);
  }

  @Query(() => [FeedbackEntity], { name: 'findAllFeedbacks' })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.MANAGE_FEEDBACK)
  async findAllFeedbacks() {
    return this.feedbackService.findAll();
  }

  @Query(() => FeedbackEntity, { name: 'findFeedbackById' })
  @UseGuards(GqlAuthGuard)
  async findFeedbackById(@Args('id', { type: () => ID }) id: string) {
    return this.feedbackService.findOne(id);
  }

  @Query(() => [FeedbackEntity], { name: 'findFeedbacksByUser' })
  @UseGuards(GqlAuthGuard)
  async findFeedbacksByUser(@Context('req') req: any) {
    const userId = req.user.sub;
    return this.feedbackService.findByUser(userId);
  }

  @Mutation(() => FeedbackEntity)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.EDIT_FEEDBACK)
  async updateFeedback(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateFeedbackInput') updateFeedbackInput: UpdateFeedbackInput,
  ) {
    return this.feedbackService.update(id, updateFeedbackInput);
  }

  @Mutation(() => FeedbackEntity)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.DELETE_FEEDBACK)
  async removeFeedback(@Args('id', { type: () => ID }) id: string) {
    return this.feedbackService.remove(id);
  }

  // FeedbackCategory CRUD
  @Mutation(() => FeedbackCategoryEntity)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.MANAGE_FEEDBACK)
  async createFeedbackCategory(
    @Args('input') input: CreateFeedbackCategoryInput,
  ) {
    return this.feedbackCategoryService.create(input.name, input.description);
  }

  @Query(() => [FeedbackCategoryEntity], { name: 'findAllFeedbackCategories' })
  @UseGuards(GqlAuthGuard)
  async findAllFeedbackCategories() {
    return this.feedbackCategoryService.findAll();
  }

  @Query(() => FeedbackCategoryEntity, { name: 'findFeedbackCategoryById' })
  @UseGuards(GqlAuthGuard)
  async findFeedbackCategoryById(@Args('id', { type: () => ID }) id: string) {
    return this.feedbackCategoryService.findOne(id);
  }

  @Mutation(() => FeedbackCategoryEntity)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.MANAGE_FEEDBACK)
  async updateFeedbackCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateFeedbackCategoryInput')
    updateFeedbackCategoryInput: UpdateFeedbackCategoryInput,
  ) {
    return this.feedbackCategoryService.update(
      id,
      updateFeedbackCategoryInput.name,
      updateFeedbackCategoryInput.description,
      updateFeedbackCategoryInput.status,
    );
  }

  @Mutation(() => FeedbackCategoryEntity)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.MANAGE_FEEDBACK)
  async removeFeedbackCategory(@Args('id', { type: () => ID }) id: string) {
    return this.feedbackCategoryService.remove(id);
  }
}
