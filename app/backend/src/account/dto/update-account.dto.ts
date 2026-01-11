import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { AccountType } from './create-account.dto';

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(AccountType)
  @IsOptional()
  type?: AccountType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balance?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsBoolean()
  @IsOptional()
  includeInTotal?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}
