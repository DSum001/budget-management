import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';

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

export class CreateTransactionDto {
  @IsEnum(TransactionType, { message: 'Invalid transaction type' })
  type: TransactionType;

  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsDateString({}, { message: 'Invalid date format' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: 'Please select category' })
  categoryId: string;

  @IsString()
  @IsNotEmpty({ message: 'Please select account' })
  accountId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsEnum(RecurringFrequency)
  @IsOptional()
  recurringFrequency?: RecurringFrequency;

  @IsDateString()
  @IsOptional()
  recurringEndDate?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}
