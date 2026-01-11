import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export enum AccountType {
  CASH = 'cash',
  BANK = 'bank',
  E_WALLET = 'e_wallet',
  CREDIT_CARD = 'credit_card',
  INVESTMENT = 'investment',
  CRYPTO = 'crypto',
}

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกชื่อบัญชี' })
  name: string;

  @IsEnum(AccountType, { message: 'ประเภทบัญชีไม่ถูกต้อง' })
  type: AccountType;

  @IsNumber()
  @Min(0, { message: 'ยอดเงินต้องไม่ติดลบ' })
  balance: number;

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
}
