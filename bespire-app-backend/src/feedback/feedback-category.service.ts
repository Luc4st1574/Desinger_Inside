import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedbackCategory } from './schema/feedback-category.schema';

@Injectable()
export class FeedbackCategoryService {
  constructor(
    @InjectModel(FeedbackCategory.name)
    private feedbackCategoryModel: Model<FeedbackCategory>,
  ) {}

  async create(name: string, description?: string): Promise<FeedbackCategory> {
    const category = new this.feedbackCategoryModel({
      name,
      description,
    });
    return category.save();
  }

  async findAll(): Promise<FeedbackCategory[]> {
    return this.feedbackCategoryModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<FeedbackCategory> {
    const category = await this.feedbackCategoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('FeedbackCategory not found');
    }
    return category;
  }

  async update(
    id: string,
    name?: string,
    description?: string,
    status?: 'active' | 'inactive',
  ): Promise<FeedbackCategory> {
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;

    const category = await this.feedbackCategoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!category) {
      throw new NotFoundException('FeedbackCategory not found');
    }
    return category;
  }

  async remove(id: string): Promise<FeedbackCategory> {
    const category = await this.feedbackCategoryModel
      .findByIdAndDelete(id)
      .exec();
    if (!category) {
      throw new NotFoundException('FeedbackCategory not found');
    }
    return category;
  }
}
