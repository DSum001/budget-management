// Transaction Models

export interface Transaction {
  _id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
  note?: string;
  category: any;
  categoryId?: string;
  account: any;
  accountId?: string;
  tags?: string[];
  location?: string;
  attachments?: string[];
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  recurringEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionType = 'income' | 'expense' | 'transfer';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface TransactionFilters {
  type?: string;
  categoryId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  tags?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTransactionDto {
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
  note?: string;
  categoryId: string;
  accountId: string;
  tags?: string[];
  location?: string;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  recurringEndDate?: Date;
}

export interface UpdateTransactionDto extends Partial<CreateTransactionDto> {}

export interface TransferDto {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: Date;
  description?: string;
}

export interface BulkDeleteDto {
  ids: string[];
}
