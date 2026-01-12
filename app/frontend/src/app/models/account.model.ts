// Account Models

export interface Account {
  _id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  includeInTotal?: boolean;
  isArchived?: boolean;
  isActive?: boolean;
  institution?: string;
  accountNumber?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AccountType = 'cash' | 'bank' | 'credit_card' | 'e_wallet' | 'investment' | 'crypto';

export interface AccountSummary {
  totalBalance: number;
  byType: AccountByType[];
}

export interface AccountByType {
  type: string;
  total: number;
  count: number;
}

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  includeInTotal?: boolean;
  institution?: string;
  accountNumber?: string;
  description?: string;
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {
  isArchived?: boolean;
  isActive?: boolean;
}
