import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกชื่อหมวดหมู่' })
  name: string;

  @IsEnum(CategoryType, { message: 'ประเภทหมวดหมู่ไม่ถูกต้อง' })
  type: CategoryType;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}
