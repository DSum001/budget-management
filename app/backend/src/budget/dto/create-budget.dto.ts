import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';

export enum BudgetPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกชื่องบประมาณ' })
  name: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsNumber()
  @Min(0.01, { message: 'จำนวนเงินต้องมากกว่า 0' })
  amount: number;

  @IsEnum(BudgetPeriod, { message: 'ช่วงเวลาไม่ถูกต้อง' })
  period: BudgetPeriod;

  @IsDateString({}, { message: 'รูปแบบวันที่ไม่ถูกต้อง' })
  startDate: string;

  @IsDateString({}, { message: 'รูปแบบวันที่ไม่ถูกต้อง' })
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
}
