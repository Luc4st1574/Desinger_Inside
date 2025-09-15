import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateFeedbackInput } from './dto/create-feedback.input';
import { UpdateFeedbackInput } from './dto/update-feedback.input';
import { Feedback } from './schema/feedback.schema';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
  ) {}

  async create(userId: string, input: CreateFeedbackInput): Promise<Feedback> {
    const feedback = new this.feedbackModel({
      ...input,
      createdBy: new Types.ObjectId(userId),
      workspace: new Types.ObjectId(input.workspace),
      category: new Types.ObjectId(input.category),
    });
    return feedback.save();
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackModel
      .find()
      .populate('createdBy', 'firstName lastName avatarUrl')
      .populate('workspace', 'name')
      .populate('category', 'name description')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Feedback> {
    const feedback = await this.feedbackModel
      .findById(id)
      .populate('createdBy', 'firstName lastName avatarUrl')
      .populate('workspace', 'name')
      .populate('category', 'name description')
      .exec();
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    return feedback;
  }

  async findByUser(userId: string): Promise<Feedback[]> {
    return this.feedbackModel
      .find({ createdBy: new Types.ObjectId(userId) })
      .populate('createdBy', 'firstName lastName avatarUrl')
      .populate('workspace', 'name')
      .populate('category', 'name description')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateFeedbackInput: UpdateFeedbackInput,
  ): Promise<Feedback> {
    const updateData: any = {};
    if (updateFeedbackInput.title) updateData.title = updateFeedbackInput.title;
    if (updateFeedbackInput.details)
      updateData.details = updateFeedbackInput.details;
    if (updateFeedbackInput.category)
      updateData.category = new Types.ObjectId(updateFeedbackInput.category);
    if (updateFeedbackInput.status)
      updateData.status = updateFeedbackInput.status;
    if (updateFeedbackInput.priority)
      updateData.priority = updateFeedbackInput.priority;

    const feedback = await this.feedbackModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('createdBy', 'firstName lastName avatarUrl')
      .populate('workspace', 'name')
      .populate('category', 'name description')
      .exec();
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    return feedback;
  }

  async remove(id: string): Promise<Feedback> {
    const feedback = await this.feedbackModel.findByIdAndDelete(id).exec();
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    return feedback;
  }
}
