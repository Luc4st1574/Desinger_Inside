import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

// Este es un sub-documento o tipo que representa el estado del request en un punto en el tiempo.
// Refleja los campos importantes del schema de Request que queremos rastrear.
@Schema({ _id: false }) // _id: false porque es un sub-objeto
class RequestSnapshot {
  @Prop()
  title?: string;

  @Prop()
  details?: string;

  @Prop()
  status: string;

  @Prop()
  priority?: string;

  @Prop()
  dueDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Brand' })
  brand?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Service' })
  service?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  assignees?: Types.ObjectId[];

  @Prop()
  internalDueDate?: Date;
}

@Schema({ timestamps: true })
export class RequestVersion extends Document {
  // Referencia al Request principal al que pertenece esta versión
  @Prop({ required: true, type: Types.ObjectId, ref: 'Request' })
  request: Types.ObjectId;

  // Quién realizó este cambio
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  // Un array con los nombres de los campos que cambiaron en esta versión.
  // Ej: ['title', 'priority']
  @Prop({ type: [String], required: true })
  changedFields: string[];

  // El objeto que contiene el estado completo del request DESPUÉS del cambio.
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  snapshot: RequestSnapshot;

  @Prop({
    required: true,
    enum: [
      'creation',
      'update',
      'status_change',
      'priority_change',
      'comment_added',
      'file_attached',
      'assignee_added',
      'assignee_removed',
      'archived',
    ],
  })
  actionType: string;

  @Prop({ type: Types.ObjectId, required: false })
  linkedDocumentId?: Types.ObjectId;
}

export const RequestVersionSchema =
  SchemaFactory.createForClass(RequestVersion);
