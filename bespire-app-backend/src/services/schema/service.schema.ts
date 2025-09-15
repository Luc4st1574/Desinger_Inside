import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ServiceCategory } from './service-category.schema'; // Importamos la clase
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Schema({
  timestamps: true,
  // --- AÑADE ESTAS OPCIONES AQUÍ ---
  toJSON: {
    virtuals: true, // Incluye los campos virtuales (como 'id')
    transform: function (doc, ret) {
      delete ret._id; // Opcional: elimina el campo _id del objeto final
      delete ret.__v; // Opcional: elimina el campo __v
    },
  },
  toObject: {
    virtuals: true, // Haz lo mismo para la conversión a objeto plano
  },
})
@ObjectType()
export class Service extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  credits: number;

  // --- EL GRAN CAMBIO ESTÁ AQUÍ ---
  // Antes: @Prop({ default: 'regular' }) type: string;
  @Prop({ required: true, type: Types.ObjectId, ref: ServiceCategory.name })
  category: Types.ObjectId; // Ahora es una referencia a una ServiceCategory

  @Prop({ default: 'active' })
  status: 'active' | 'inactive';

  @Prop({ type: [String], default: [] })
  inclusions: string[];

  @Prop({ type: [String], default: [] })
  exclusions: string[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
