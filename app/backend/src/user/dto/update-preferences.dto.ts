import { IsString, IsBoolean, IsOptional, IsObject } from 'class-validator';

export class UpdatePreferencesDto {
  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  theme?: string;

  @IsBoolean()
  @IsOptional()
  notifications?: boolean;

  @IsString()
  @IsOptional()
  dateFormat?: string;

  @IsString()
  @IsOptional()
  timeFormat?: string;

  @IsObject()
  @IsOptional()
  other?: Record<string, any>;
}
