import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AccountDocument = Account & Document;

export enum AccountType {
  CASH = 'cash',
  BANK = 'bank',
  CREDIT_CARD = 'credit_card',
  E_WALLET = 'e_wallet',
  INVESTMENT = 'investment',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Account extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: AccountType })
  type: AccountType;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ default: 'THB' })
  currency: string;

  @Prop({ trim: true })
  bankName?: string;

  @Prop({ trim: true })
  accountNumber?: string;

  @Prop()
  color?: string; // for UI display

  @Prop()
  icon?: string; // for UI display

  @Prop({ default: true })
  includeInTotal: boolean; // include in total balance calculation

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ trim: true })
  notes?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

// Indexes
AccountSchema.index({ userId: 1, isArchived: 1 });
AccountSchema.index({ userId: 1, type: 1 });
