import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateNoteInput } from './dto/update-note.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { PERMISSIONS } from 'src/auth/permissions.constants';
@Resolver(() => Note)
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  @Mutation(() => Note)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.CREATE_NOTES)
  async createNote(
    @Args('createNoteInput') createNoteInput: CreateNoteInput,
    @Context('req') req: any,
  ) {
    const userId = req.user.sub;
    return this.notesService.create({ ...createNoteInput, createdBy: userId });
  }

  @Query(() => [Note], { name: 'notes' })
  async findAll() {
    return this.notesService.findAll();
  }

  @Query(() => Note, { name: 'note' })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.notesService.findOne(id);
  }

  @Mutation(() => Note)
  async updateNote(@Args('updateNoteInput') updateNoteInput: UpdateNoteInput) {
    return this.notesService.update(updateNoteInput.id, updateNoteInput);
  }

  @Mutation(() => Note)
  async removeNote(@Args('id', { type: () => ID }) id: string) {
    return this.notesService.remove(id);
  }
}
