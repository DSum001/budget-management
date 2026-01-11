import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateSavingGoalDto {
  @IsString()
  @IsNotEmpty({ message: 'Please enter goal name' })
  name: string;

  @IsNumber()
  @Min(0.01, { message: 'Goal must be greater than 0' })
  targetAmount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  currentAmount?: number;

  @IsDateString({}, { message: 'Invalid date format' })
  targetDate: string;

  @IsString()
  @IsOptional()
  linkedAccountId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;
}
