import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesResolver } from './notes.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schema/notes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
  ],
  providers: [NotesResolver, NotesService],
  exports: [NotesService],
})
export class NotesModule {}
