import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BudgetDocument = Budget & Document;

export enum BudgetPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Schema({ timestamps: true, collection: 'budgets' })
export class Budget extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: false })
  categoryId?: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: BudgetPeriod })
  period: BudgetPeriod;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop({ default: 0 })
  spent: number; // current spending in this period

  @Prop({ default: true })
  alertEnabled: boolean;

  @Prop({ default: 80 })
  alertThreshold: number; // percentage (e.g., 80 = alert at 80% of budget)

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ trim: true })
  notes?: string;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);

// Indexes
BudgetSchema.index({ userId: 1, categoryId: 1, period: 1 });
BudgetSchema.index({ userId: 1, isActive: 1, startDate: 1 });
BudgetSchema.index({ userId: 1, endDate: 1 });
