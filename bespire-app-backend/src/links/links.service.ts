import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Link } from './schema/links.schema';
import { ClientSession, Model, Types } from 'mongoose';
import { CreateLinkInput } from './dto/create-link.input';

@Injectable()
export class LinksService {
  constructor(@InjectModel(Link.name) private linkModel: Model<Link>) {}
  async create(
    input: CreateLinkInput,
    userId: string,
    session?: ClientSession,
  ): Promise<Link> {
    const linkedToId = new Types.ObjectId(input.linkedToId);
    delete input.linkedToId; // Elimina el campo para evitar duplicados
    const [link] = await this.linkModel.create(
      [
        {
          ...input,
          linkedToId,
          createdBy: new Types.ObjectId(userId),
        },
      ],
      { session },
    );
    return link;
  }

  async findByLinkedToId(linkedToId: string): Promise<Link[]> {
    const linkedToIdObject = new Types.ObjectId(linkedToId);
    return this.linkModel
      .find({ linkedToId: linkedToIdObject })
      .sort({ createdAt: -1 })
      .lean();
  }

  async delete(linkId: string, userId: string): Promise<boolean> {
    // Opcional: Solo permitir que el creador lo borre, o admin
    const linkIdObject = new Types.ObjectId(linkId);
    const userIdObject = new Types.ObjectId(userId);
    const result = await this.linkModel.deleteOne({
      _id: linkIdObject,
      createdBy: userIdObject,
    });
    return result.deletedCount > 0;
  }

  async deleteByLinkedToId(
    linkedToId: string,
    session?: ClientSession,
  ): Promise<boolean> {
    const linkedToIdObject = new Types.ObjectId(linkedToId);
    const result = await this.linkModel.deleteMany(
      {
        linkedToId: linkedToIdObject,
      },
      { session },
    );
    return result.deletedCount > 0;
  }
}
