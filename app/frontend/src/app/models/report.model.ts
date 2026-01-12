// Report and Analytics Models

export interface Dashboard {
  overview: DashboardOverview;
  byCategory: CategorySummary[];
  byAccount: ReportAccountSummary[];
  recentTransactions: any[];
}

export interface DashboardOverview {
  income: number;
  expense: number;
  balance: number;
  month: number;
  year: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  total: number;
  count: number;
  percentage?: number;
}

export interface ReportAccountSummary {
  accountId: string;
  accountName: string;
  total: number;
  count: number;
}

export interface IncomExpenseTrend {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryAnalysis {
  type: 'income' | 'expense';
  categories: CategoryBreakdown[];
  total: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  income: number;
  expense: number;
  balance: number;
  savings: number;
}

export interface BudgetPerformance {
  budgetId: string;
  budgetName: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'on-track' | 'warning' | 'over-budget';
}

export interface RemainingBalance {
  period: 'daily' | 'weekly' | 'monthly';
  summary: {
    totalIncome: number;
    totalExpense: number;
    netAmount: number;
  };
  breakdown: any[];
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  categoryId?: string;
  accountId?: string;
  groupBy?: 'day' | 'week' | 'month' | 'year';
}
