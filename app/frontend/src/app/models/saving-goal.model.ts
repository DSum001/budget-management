// Saving Goal Models

export interface SavingGoal {
  _id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  status: GoalStatus;
  linkedAccountId?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export interface GoalProgress {
  targetAmount: number;
  currentAmount: number;
  remaining: number;
  progressPercentage: number;
  daysLeft: number;
  monthlyRequired: number;
  dailyRequired?: number;
  isOverdue: boolean;
  isCompleted: boolean;
}

export interface CreateGoalDto {
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate: Date;
  linkedAccountId?: string;
}

export interface UpdateGoalDto extends Partial<CreateGoalDto> {
  status?: GoalStatus;
}

export interface UpdateProgressDto {
  amount: number;
  note?: string;
}
