import { Field, ObjectType, ID } from '@nestjs/graphql';
import { FeedbackCategoryEntity } from './feedback-category.entity';

@ObjectType()
export class UserEntity {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  avatarUrl?: string;
}

@ObjectType()
export class WorkspaceEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}

@ObjectType()
export class FeedbackEntity {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  details: string;

  @Field(() => UserEntity)
  createdBy: UserEntity;

  @Field(() => WorkspaceEntity)
  workspace: WorkspaceEntity;

  @Field()
  code: string;

  @Field()
  status: string;

  @Field()
  priority: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
