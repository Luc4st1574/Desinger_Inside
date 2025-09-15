// src/team/schemas/team-member-profile.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Document, Types } from 'mongoose';

export type EmploymentType = 'full_time' | 'part_time' | 'contractor';

@ObjectType()
@Schema({ timestamps: true })
export class TeamMemberProfile extends Document {
  @Field(() => ID) _id: string;

  @Field(() => ID)
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    unique: true,
    index: true,
    required: true,
  })
  user: Types.ObjectId; // 1:1 con User

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  manager?: Types.ObjectId; // manager global (opcional)

  @Field({ nullable: true })
  @Prop()
  description?: string; // bio

  @Field({ nullable: true })
  @Prop()
  employmentType?: EmploymentType; // full_time | part_time | contractor

  @Field({ nullable: true })
  @Prop()
  contractStart?: Date;

  @Field({ nullable: true })
  @Prop()
  contractEnd?: Date;

  @Field({ nullable: true })
  @Prop()
  timezone?: string; // “America/Los_Angeles”

  @Field({ nullable: true })
  @Prop()
  country?: string;

  @Field({ nullable: true })
  @Prop()
  state?: string;

  @Field({ nullable: true })
  @Prop()
  city?: string;

  @Field({ nullable: true })
  @Prop()
  workHours?: number;

  @Field({ nullable: true })
  @Prop()
  phone?: string; // si no quieres mezclar con User.contactNumber

  @Field({ nullable: true })
  @Prop()
  birthday?: Date;

  @Field({ nullable: true })
  @Prop()
  isActive?: boolean;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String], default: [] })
  tags?: string[]; // chips
}

export const TeamMemberProfileSchema =
  SchemaFactory.createForClass(TeamMemberProfile);
