import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFeedbackCategoryInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateFeedbackCategoryInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  status?: 'active' | 'inactive';
}
