// src/requests/schemas/request.schema.ts
import { Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { ObjectType } from '@nestjs/graphql';
import { ActivityLog } from 'src/activity/schema/activity.schema';
import { Comment } from 'src/comments/schema/comments.schema';
import { Assignee } from 'src/assignee/schema/assignee.schema';
import { Link } from 'src/links/schema/links.schema';
import { File } from 'src/files/schema/files.schema';
import { RequestVersion } from 'src/request-version/schema/request-version.schema';

@ObjectType()
@Schema({ timestamps: true })
export class Request extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  details: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId; // quien crea la solicitud

  @Prop({ required: true, type: Types.ObjectId, ref: 'Workspace' })
  workspace: Types.ObjectId; // Workspace al que pertenece la solicitud

  @Prop({ type: Types.ObjectId, ref: 'Brand' })
  brand?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Service' })
  service?: Types.ObjectId;

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

  @Prop()
  dueDate?: Date;

  //internal due date
  @Prop()
  internalDueDate?: Date;

  @Prop({ type: Number, default: 1 })
  credits: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  assignees: Types.ObjectId[];

  @Prop({
    type: {
      hours: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
    },
    default: { hours: 0, minutes: 0 },
  })
  timeSpent: {
    hours: number;
    minutes: number;
  };

  @Prop({ type: Types.ObjectId, ref: 'Request', default: null })
  parentRequest?: Types.ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Prop({ type: Date, default: null })
  completedAt?: Date;

  @Prop({ type: Date, default: null, index: true }) // 'index: true' para optimizar las búsquedas
  archivedAt?: Date;
}

export const RequestSchema = SchemaFactory.createForClass(Request);

RequestSchema.pre('findOneAndDelete', async function (next) {
  console.log('Middleware PRE findOneAndDelete ejecutado para Request');
  const requestId = this.getFilter()['_id'];
  console.log(`ID del request a borrar: ${requestId}`);

  const requestObjectId = new Types.ObjectId(requestId);

  if (!requestId) {
    console.log('No se pudo encontrar el ID del request, saltando la cascada.');
    return next();
  }

  try {
    // ahora necesito acceder a todos los modelos relacionados con el request
    await this.model.db
      .model(ActivityLog.name)
      .deleteMany({ linkedToId: requestObjectId });
    console.log(
      `Borrados en cascada todos los activity logs del request ${requestId}`,
    );
    //lo mismo para comments y assignees
    await this.model.db
      .model(Comment.name)
      .deleteMany({ linkedToId: requestObjectId });
    await this.model.db
      .model(Assignee.name)
      .deleteMany({ linkedToId: requestObjectId });

    await this.model.db
      .model(Link.name)
      .deleteMany({ linkedToId: requestObjectId });

    //files
    await this.model.db
      .model(File.name)
      .deleteMany({ linkedToId: requestObjectId });

    //request version
    await this.model.db
      .model(RequestVersion.name)
      .deleteMany({ request: requestObjectId });
    next();
  } catch (error) {
    console.error('Error en el borrado en cascada:', error);
    next(error); // Pasa el error para detener la operación si algo sale mal
  }
});
