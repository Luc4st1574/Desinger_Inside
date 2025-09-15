import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackResolver } from './feedback.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from './schema/feedback.schema';
import {
  FeedbackCategory,
  FeedbackCategorySchema,
} from './schema/feedback-category.schema';
import { FeedbackCategoryService } from './feedback-category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
      { name: FeedbackCategory.name, schema: FeedbackCategorySchema },
    ]),
  ],
  providers: [FeedbackResolver, FeedbackService, FeedbackCategoryService],
})
export class FeedbackModule {}
