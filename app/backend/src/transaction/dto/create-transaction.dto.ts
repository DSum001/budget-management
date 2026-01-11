import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @IsEnum(['income', 'expense'])
  type: string;

  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  date: Date;
}
