import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Schema({ timestamps: true })
export class Category extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: CategoryType })
  type: CategoryType;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parentId: Types.ObjectId; // for sub-category

  @Prop()
  color?: string;

  @Prop()
  icon?: string;

  @Prop({ default: 0 })
  order: number; // for custom sorting

  @Prop({ default: false })
  isSystem: boolean; // system-defined categories cannot be deleted

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ trim: true })
  description?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Indexes
CategorySchema.index({ userId: 1, type: 1, isActive: 1 });
CategorySchema.index({ userId: 1, parentId: 1 });
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });
