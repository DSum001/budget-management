import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string; // hashed password

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ default: 'THB' })
  defaultCurrency: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLoginAt: Date;

  @Prop({ type: Object })
  preferences: {
    language: string;
    dateFormat: string;
    theme: string;
    notifications: boolean;
    timeFormat?: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });
