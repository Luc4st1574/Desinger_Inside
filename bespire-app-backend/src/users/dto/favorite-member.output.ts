import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FavoriteMember {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  avatar: string;

  @Field()
  role?: string;

  @Field()
  rating: number;

  //services
  @Field(() => [String], { nullable: true })
  services?: string[];
}
