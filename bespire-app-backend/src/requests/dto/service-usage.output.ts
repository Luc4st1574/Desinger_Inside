import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ServiceUsage {
  @Field(() => ID)
  _id: string;

  @Field()
  Type: string;

  @Field()
  count: number;
}
