import { CreateNoteInput } from './create-note.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNoteInput extends PartialType(CreateNoteInput) {
  @Field(() => ID)
  id: string;
}
