import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';
import {
  TransactionType,
  RecurringFrequency,
} from './create-transaction-v2.dto';

export class UpdateTransactionDto {
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  accountId?: string;

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
