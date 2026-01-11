import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';
import { BudgetPeriod } from './create-budget.dto';

export class UpdateBudgetDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @IsEnum(BudgetPeriod)
  @IsOptional()
  period?: BudgetPeriod;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  alertEnabled?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  alertThreshold?: number;

  @IsBoolean()
  @IsOptional()
  rollover?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
