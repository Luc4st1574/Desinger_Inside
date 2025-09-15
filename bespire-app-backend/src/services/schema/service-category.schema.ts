import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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
export class ServiceCategory extends Document {
  @Prop({ required: true, unique: true })
  name: string; // Ej: "Motion Graphics", "Web", "Brand"

  @Prop({ required: false })
  description: string; // Ej: "Custom animated text for videos, presentations, or ads."

  @Prop({ default: 'active' })
  status: 'active' | 'inactive';
}

export const ServiceCategorySchema =
  SchemaFactory.createForClass(ServiceCategory);
