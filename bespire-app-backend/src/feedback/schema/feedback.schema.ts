import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FeedbackCategory } from './feedback-category.schema';

@Schema({ timestamps: true })
export class Feedback extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  details: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId; // quien crea la solicitud

  @Prop({ required: true, type: Types.ObjectId, ref: 'Workspace' })
  workspace: Types.ObjectId; // Workspace al que pertenece la solicitud

  @Prop({ default: 'queued' })
  status:
    | 'in_progress'
    | 'for_review'
    | 'for_approval'
    | 'revision'
    | 'completed'
    | 'queued'
    | 'needs_info'
    | 'cancelled';

  @Prop({ default: 'medium' })
  priority: 'low' | 'medium' | 'high' | 'none';

  @Prop({ unique: true })
  code: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);

// Hook pre-save para generar código automáticamente
FeedbackSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastFeedback = await (this.constructor as any)
      .findOne()
      .sort({ createdAt: -1 });
    let nextNumber = 1;
    if (lastFeedback && lastFeedback.code) {
      const lastNumber = parseInt(lastFeedback.code.split('-')[1]);
      nextNumber = lastNumber + 1;
    }
    this.code = `BSP-${nextNumber.toString().padStart(4, '0')}`;
  }
  next();
});
