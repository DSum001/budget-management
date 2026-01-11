import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CategoryType } from './create-category.dto';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
