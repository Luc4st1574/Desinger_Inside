import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateNoteInput } from './dto/update-note.input';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './schema/notes.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async create(createNoteInput: CreateNoteInput) {
    const created = new this.noteModel({ ...createNoteInput });
    const saved = await created.save();
    return this.noteModel
      .findById(saved._id)
      .populate('createdBy', 'firstName lastName')
      .populate('userClient', 'firstName lastName')
      .exec();
  }

  async findAll() {
    return this.noteModel
      .find()
      .populate('createdBy', 'firstName lastName')
      .populate('userClient', 'firstName lastName')
      .exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid id');
    const note = await this.noteModel
      .findById(id)
      .populate('createdBy', 'firstName lastName')
      .populate('userClient', 'firstName lastName')
      .exec();
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async update(id: string, updateNoteInput: UpdateNoteInput) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid id');
    const note = await this.noteModel
      .findByIdAndUpdate(id, { $set: updateNoteInput }, { new: true })
      .populate('createdBy', 'firstName lastName')
      .populate('userClient', 'firstName lastName')
      .exec();
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid id');
    const note = await this.noteModel.findByIdAndDelete(id).exec();
    if (!note) throw new NotFoundException('Note not found');
    return { deleted: true, _id: note._id } as any;
  }
}
