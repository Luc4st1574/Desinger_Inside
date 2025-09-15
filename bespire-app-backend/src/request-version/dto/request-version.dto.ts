import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserSnapshot {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  avatarUrl?: string;
}

@ObjectType()
export class SnapshotDataOut {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  details?: string;

  @Field({ nullable: true })
  priority?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  internalDueDate?: Date;

  @Field(() => [UserSnapshot], { nullable: true })
  assignees?: UserSnapshot[];

  @Field({ nullable: true })
  brand?: string; // Asumiendo ObjectId como string

  @Field({ nullable: true })
  service?: string; // Asumiendo ObjectId como string
}

@ObjectType()
export class RequestVersionOut {
  @Field()
  request: string;

  @Field(() => UserSnapshot)
  updatedBy: UserSnapshot;

  @Field(() => [String])
  changedFields: string[];

  @Field()
  actionType?: string;

  @Field(() => SnapshotDataOut)
  snapshot: SnapshotDataOut;

  @Field()
  createdAt: Date;
}
