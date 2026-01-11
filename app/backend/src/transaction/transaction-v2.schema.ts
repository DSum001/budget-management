import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export enum RecurringFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Schema({ timestamps: true })
export class Transaction extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  accountId: Types.ObjectId;

  // For transfer transactions
  @Prop({ type: Types.ObjectId, ref: 'Account' })
  toAccountId?: Types.ObjectId;

  @Prop({ trim: true })
  description: string;

  @Prop({ trim: true })
  note?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  // Recurring transaction
  @Prop({ default: false })
  isRecurring: boolean;

  @Prop({ enum: RecurringFrequency })
  recurringFrequency?: RecurringFrequency;

  @Prop()
  recurringEndDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Transaction' })
  recurringParentId?: Types.ObjectId; // reference to parent recurring transaction

  // Attachments
  @Prop({ type: [String], default: [] })
  attachments: string[]; // file URLs or paths

  // Location (optional feature)
  @Prop()
  location?: string;

  @Prop({ type: Object })
  coordinates?: {
    latitude: number;
    longitude: number;
  };

  // Status
  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Indexes for performance
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, type: 1, date: -1 });
TransactionSchema.index({ userId: 1, categoryId: 1, date: -1 });
TransactionSchema.index({ userId: 1, accountId: 1, date: -1 });
TransactionSchema.index({ userId: 1, isDeleted: 1, date: -1 });
TransactionSchema.index({ tags: 1 });
TransactionSchema.index({ isRecurring: 1, recurringEndDate: 1 });
