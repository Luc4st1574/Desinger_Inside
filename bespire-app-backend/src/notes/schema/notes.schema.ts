// plan.schema.ts
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

function slugify(value: string) {
  if (!value) return '';
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^a-z0-9\-]/g, '') // Remove all non-alphanumeric and -
    .replace(/-+/g, '-'); // Collapse multiple -
}

@ObjectType()
@Schema({ timestamps: true })
export class Note extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: false })
  slug?: string;

  @Field()
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId; // creador

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  userClient?: Types.ObjectId; // usuario al que se le hace la nota

  @Prop({ required: true, type: Types.ObjectId, ref: 'Workspace' })
  workspace: Types.ObjectId; // Workspace al que pertenece el cliente al que le hacen la nota

  @Field(() => [String])
  @Prop({ type: [String], default: ['notes'] })
  tags: string[];

  /** Timestamps automáticos */
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

// Generar slug automáticamente antes de guardar si cambia title
NoteSchema.pre('save', function (next) {
  if ((this as any).isModified && (this as any).isModified('title')) {
    (this as any).slug = slugify((this as any).title);
  }
  // si todavía no tiene slug (por creación), generarla
  if (!(this as any).slug && (this as any).title) {
    (this as any).slug = slugify((this as any).title);
  }
  next();
});

// Cuando usamos findOneAndUpdate / findByIdAndUpdate, actualizar el slug si se modifica el title
NoteSchema.pre('findOneAndUpdate', function (next) {
  const update: any = this.getUpdate ? this.getUpdate() : {}; // query middleware
  const title = update?.title || (update?.$set && update.$set.title);
  if (title) {
    const newSlug = slugify(title);
    if (update.$set) update.$set.slug = newSlug;
    else update.slug = newSlug;
    this.setUpdate(update);
  }
  next();
});
