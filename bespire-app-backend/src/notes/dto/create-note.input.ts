import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateNoteInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => ID)
  createdBy: string; // ObjectId string

  @Field(() => ID, { nullable: true })
  userClient?: string;

  @Field(() => ID)
  workspace: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
