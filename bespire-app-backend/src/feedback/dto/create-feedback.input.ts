import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateFeedbackInput {
  @Field()
  title: string;

  @Field()
  details: string;

  @Field(() => ID)
  category: string; // ID de FeedbackCategory

  @Field(() => ID)
  workspace: string; // ID del Workspace

  @Field({ nullable: true })
  sendCopy?: boolean;
}
