import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class UpdateProgressDto {
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
