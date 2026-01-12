// Budget Models

export interface Budget {
  _id: string;
  name: string;
  amount: number;
  spent: number;
  period: BudgetPeriod;
  category: string;
  categoryId?: string;
  categoryName?: string;
  startDate: Date;
  endDate?: Date;
  alertEnabled: boolean;
  alertThreshold: number;
  rollover: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface BudgetStatus {
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  shouldAlert: boolean;
  daysLeft: number;
}

export interface CreateBudgetDto {
  name: string;
  amount: number;
  period: BudgetPeriod;
  categoryId?: string;
  startDate: Date;
  endDate?: Date;
  alertEnabled?: boolean;
  alertThreshold?: number;
  rollover?: boolean;
}

export interface UpdateBudgetDto extends Partial<CreateBudgetDto> {
  isActive?: boolean;
}
