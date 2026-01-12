// Application Constants

export const APP_CONFIG = {
  APP_NAME: 'Budget Management',
  VERSION: '1.0.0',
  DEFAULT_CURRENCY: 'THB',
  DEFAULT_LOCALE: 'th-TH',
  DATE_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const ACCOUNT_TYPES = {
  CASH: 'cash',
  BANK: 'bank',
  CREDIT_CARD: 'credit_card',
  E_WALLET: 'e_wallet',
  INVESTMENT: 'investment',
  CRYPTO: 'crypto',
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
} as const;

export const CATEGORY_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const BUDGET_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
} as const;

export const RECURRING_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  ACCOUNTS: '/accounts',
  CATEGORIES: '/categories',
  TRANSACTIONS: '/transactions',
  BUDGETS: '/budgets',
  SAVING_GOALS: '/saving-goals',
  REPORTS: '/reports',
} as const;

export const CURRENCY_SYMBOLS: Record<string, string> = {
  THB: '฿',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
} as const;

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  cash: 'เงินสด',
  bank: 'ธนาคาร',
  credit_card: 'บัตรเครดิต',
  e_wallet: 'กระเป๋าเงินอิเล็กทรอนิกส์',
  investment: 'การลงทุน',
  crypto: 'สกุลเงินดิจิทัล',
} as const;

export const ACCOUNT_TYPE_ICONS: Record<string, string> = {
  cash: '💵',
  bank: '🏦',
  credit_card: '💳',
  e_wallet: '📱',
  investment: '📈',
  crypto: '₿',
} as const;

export const BUDGET_PERIOD_LABELS: Record<string, string> = {
  daily: 'รายวัน',
  weekly: 'รายสัปดาห์',
  monthly: 'รายเดือน',
  yearly: 'รายปี',
} as const;

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  income: 'รายรับ',
  expense: 'รายจ่าย',
  transfer: 'โอนเงิน',
} as const;

export const DEFAULT_COLORS = [
  '#FF5722',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
] as const;
