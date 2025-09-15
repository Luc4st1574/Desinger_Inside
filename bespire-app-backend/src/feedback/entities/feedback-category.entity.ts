import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class FeedbackCategoryEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
