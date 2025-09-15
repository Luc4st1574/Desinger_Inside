import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schema/comments.schema';
import { Model, Types } from 'mongoose';
import { CreateCommentInput } from './dto/create-comment.input';
import { NotificationsService } from 'src/notifications/notifications.service';
import { RequestComment } from 'src/requests/dto/request-detail.output';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(input: CreateCommentInput, userId: string): Promise<Comment> {
    const comment = new this.commentModel({
      ...input,
      user: new Types.ObjectId(userId),
      linkedToId: new Types.ObjectId(input.linkedToId),
    });

    await comment.save();

    // Create a notification for the user
    await this.notificationsService.notify({
      users: [new Types.ObjectId(userId)],
      type: 'comment',
      category: input.linkedToType,
      linkedToId: new Types.ObjectId(comment._id),
    });

    return comment;
  }

  async findAllByLinkedTo(linkedToId: string): Promise<RequestComment[]> {
    const comments = await this.commentModel
      .find({ linkedToId: new Types.ObjectId(linkedToId) })
      .populate('user')
      .sort({ createdAt: 1 });
    const commentItems = comments.map((c) => ({
      id: c._id.toString(),
      user: {
        id: (c as any).user._id.toString(),
        name: `${(c as any).user.firstName} ${(c as any).user.lastName}`.trim(),
        avatarUrl: (c as any).user.avatarUrl || '',
      },
      createdAt: (c as any).createdAt.toISOString(),
      updatedAt: (c as any).updatedAt.toISOString(),
      text: (c as any).text,
    }));
    return commentItems;
  }
  async findById(id: string): Promise<Comment> {
    return this.commentModel.findById(id).populate('user');
  }
}
