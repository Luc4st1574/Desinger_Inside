// src/services/dto/create-service.input.ts
import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class CreateServiceInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  credits: number;

  @Field(() => ID) // Recibimos el ID de la categoría
  categoryId: string;

  @Field(() => [String], { nullable: true })
  inclusions?: string[];

  @Field(() => [String], { nullable: true })
  exclusions?: string[];
}
