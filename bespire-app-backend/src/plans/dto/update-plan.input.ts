import { CreatePlanInput } from './create-plan.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdatePlanInput extends PartialType(CreatePlanInput) {
  @Field(() => ID)
  id: string;
}
