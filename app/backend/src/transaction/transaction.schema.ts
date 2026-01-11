import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true, enum: ['income', 'expense'] })
  type: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  date: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
