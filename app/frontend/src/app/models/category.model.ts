// Category Models

export interface Category {
  _id: string;
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
  isSystem?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CategoryType = 'income' | 'expense';

export interface CategoryTree extends Category {
  children?: Category[];
}

export interface CreateCategoryDto {
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  isActive?: boolean;
}
