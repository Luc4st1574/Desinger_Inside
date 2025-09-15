import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

// service-category.type.ts
@ObjectType()
export class ServiceCategoryType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}

// service.type.ts
@ObjectType()
export class ServiceType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  credits: number;

  @Field({ defaultValue: 'active' })
  status?: 'active' | 'inactive';

  @Field(() => [String], { defaultValue: [] })
  inclusions?: string[];

  @Field(() => [String], { defaultValue: [] })
  exclusions?: string[];

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => ServiceCategoryType)
  category: ServiceCategoryType;
}
