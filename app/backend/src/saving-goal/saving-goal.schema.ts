import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SavingGoalDocument = SavingGoal & Document;

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class SavingGoal extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  targetAmount: number;

  @Prop({ default: 0 })
  currentAmount: number;

  @Prop({ default: 'THB' })
  currency: string;

  @Prop({ required: true })
  targetDate: Date;

  @Prop({ enum: GoalStatus, default: GoalStatus.ACTIVE })
  status: GoalStatus;

  @Prop()
  icon?: string;

  @Prop()
  color?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Account' })
  linkedAccountId?: Types.ObjectId; // optional: track from specific account

  @Prop()
  completedAt?: Date;
}

export const SavingGoalSchema = SchemaFactory.createForClass(SavingGoal);

// Indexes
SavingGoalSchema.index({ userId: 1, status: 1 });
SavingGoalSchema.index({ userId: 1, targetDate: 1 });
