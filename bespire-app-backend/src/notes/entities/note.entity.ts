import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class NoteUser {
  @Field(() => ID)
  _id: string | Types.ObjectId;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;
}

@ObjectType()
export class Note {
  @Field(() => ID)
  _id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  content: string;

  @Field(() => NoteUser)
  createdBy: NoteUser | string;

  @Field(() => NoteUser, { nullable: true })
  userClient?: NoteUser | string;

  @Field(() => ID)
  workspace: string;

  @Field(() => [String])
  tags: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
