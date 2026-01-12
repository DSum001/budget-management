# Frontend Services Documentation

## Overview

This folder contains all Angular services for communicating with the backend API. Each service handles specific domain operations and provides typed interfaces for data models.

## Services

### 1. **AuthService** (`auth.service.ts`)

Handles user authentication and session management.

**Methods:**

- `register(data)` - Register new user
- `login(email, password)` - User login
- `logout()` - Clear session and logout
- `getProfile()` - Get current user profile
- `updateProfile(data)` - Update user profile
- `updatePassword(data)` - Change password
- `getCurrentUser()` - Get current user from BehaviorSubject

**Interfaces:**

- `User` - User data model
- `LoginResponse` - Login/register response with token

---

### 2. **AccountService** (`account.service.ts`)

Manages financial accounts (bank, cash, credit cards, etc.).

**Methods:**

- `getAll()` - Get all accounts
- `getById(id)` - Get single account
- `getSummary()` - Get account summary with totals
- `create(data)` - Create new account
- `update(id, data)` - Update account
- `delete(id)` - Delete account

**Interfaces:**

- `Account` - Account data model with types: `cash`, `bank`, `credit_card`, `e_wallet`, `investment`, `crypto`
- `AccountSummary` - Summary statistics

---

### 3. **CategoryService** (`category.service.ts`)

Manages transaction categories for income and expenses.

**Methods:**

- `getAll(type?)` - Get all categories (optionally filter by type)
- `getTree(type?)` - Get categories as tree structure
- `getById(id)` - Get single category
- `create(data)` - Create new category
- `update(id, data)` - Update category
- `delete(id)` - Delete category
- `initializeDefaults()` - Create default categories

**Interfaces:**

- `Category` - Category model with type `income` or `expense`
- `CategoryTree` - Category with nested children

---

### 4. **TransactionService** (`transaction.service.ts`)

Handles income, expense, and transfer transactions.

**Methods:**

- `getAll(filters?)` - Get all transactions with optional filters
- `getById(id)` - Get single transaction
- `create(data)` - Create new transaction
- `update(id, data)` - Update transaction
- `delete(id)` - Delete transaction
- `bulkDelete(ids)` - Delete multiple transactions
- `transfer(data)` - Transfer money between accounts
- `getTransactions()` - Legacy method returning array
- `addTransaction(data)` - Legacy create method
- `deleteTransaction(id)` - Legacy delete method

**Interfaces:**

- `Transaction` - Transaction model with type: `income`, `expense`, `transfer`
- `TransactionFilters` - Filter options for querying
- `TransactionResponse` - Paginated response

---

### 5. **BudgetService** (`budget.service.ts`)

Manages budgets and spending limits.

**Methods:**

- `getAll(period?)` - Get all budgets
- `getById(id)` - Get single budget
- `getStatus(id)` - Get budget status with spending
- `create(data)` - Create new budget
- `update(id, data)` - Update budget
- `delete(id)` - Delete budget

**Interfaces:**

- `Budget` - Budget model with period: `daily`, `weekly`, `monthly`, `yearly`
- `BudgetStatus` - Budget status with remaining amount

---

### 6. **SavingGoalService** (`saving-goal.service.ts`)

Manages savings goals and progress tracking.

**Methods:**

- `getAll(status?)` - Get all goals
- `getById(id)` - Get single goal
- `create(data)` - Create new goal
- `update(id, data)` - Update goal
- `updateProgress(id, amount, note?)` - Add money to goal
- `complete(id)` - Mark goal as completed
- `delete(id)` - Delete goal

**Interfaces:**

- `SavingGoal` - Goal model with status: `active`, `completed`, `paused`, `cancelled`
- `GoalProgress` - Progress calculation with daily/monthly targets

---

### 7. **ReportService** (`report.service.ts`)

Generates financial reports and analytics.

**Methods:**

- `getDashboard(month?, year?)` - Get dashboard overview
- `getIncomeExpenseTrend(groupBy, startDate?, endDate?)` - Get income/expense trends
- `getCategoryAnalysis(type, month?, year?)` - Analyze spending by category
- `getMonthlyTrend(months)` - Get monthly trends
- `getTopExpenses(limit, month?, year?)` - Get top expenses
- `getBudgetPerformance(month?, year?)` - Get budget performance
- `getAccountBalanceHistory(accountId, startDate?, endDate?)` - Get balance history
- `getRemainingBalance(period, startDate?, endDate?)` - Get remaining balance
- `getExpensesWithBalance(filters)` - Get expenses with balance calculation

**Interfaces:**

- `Dashboard` - Dashboard data with overview, categories, accounts, transactions

---

## HTTP Interceptor

### **authInterceptor** (`interceptors/auth.interceptor.ts`)

Automatically adds JWT token to all HTTP requests and handles 401 errors.

**Features:**

- Adds `Authorization: Bearer <token>` header
- Redirects to login on 401 Unauthorized
- Clears local storage on auth failure

---

## Usage Examples

### Using AccountService

```typescript
constructor(private accountService: AccountService) {}

loadAccounts() {
  this.accountService.getAll().subscribe({
    next: (accounts) => {
      this.accounts = accounts;
    },
    error: (err) => {
      console.error('Error loading accounts:', err);
    }
  });
}

createAccount() {
  const newAccount = {
    name: 'My Bank Account',
    type: 'bank' as const,
    balance: 10000,
    currency: 'THB'
  };

  this.accountService.create(newAccount).subscribe({
    next: (account) => {
      console.log('Created:', account);
    }
  });
}
```

### Using TransactionService

```typescript
constructor(private transactionService: TransactionService) {}

loadTransactions() {
  const filters = {
    type: 'expense',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    limit: 20
  };

  this.transactionService.getAll(filters).subscribe({
    next: (response) => {
      this.transactions = response.transactions;
      this.total = response.total;
    }
  });
}

transferMoney() {
  const transferData = {
    fromAccountId: 'account1',
    toAccountId: 'account2',
    amount: 1000,
    date: new Date(),
    description: 'Transfer to savings'
  };

  this.transactionService.transfer(transferData).subscribe({
    next: (result) => {
      console.log('Transfer successful:', result);
    }
  });
}
```

### Using ReportService

```typescript
constructor(private reportService: ReportService) {}

loadDashboard() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  this.reportService.getDashboard(currentMonth, currentYear).subscribe({
    next: (dashboard) => {
      this.income = dashboard.overview.income;
      this.expense = dashboard.overview.expense;
      this.balance = dashboard.overview.balance;
    }
  });
}
```

---

## Error Handling

All services use RxJS Observables. Always handle both success and error cases:

```typescript
this.service.method().subscribe({
  next: (data) => {
    // Handle success
  },
  error: (err) => {
    // Handle error
    console.error('Error:', err);
    // Show user-friendly message
  },
});
```

---

## Environment Configuration

API base URL is configured in `environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

Change `apiUrl` to point to your backend server.

---

## Type Safety

All services provide TypeScript interfaces for request/response data. Always use these interfaces for type safety:

```typescript
import { Account, AccountService } from './services/account.service';

// ✅ Good - Type safe
const account: Account = {
  name: 'Bank',
  type: 'bank',
  balance: 1000,
  currency: 'THB',
};

// ❌ Bad - No type safety
const account = {
  name: 'Bank',
  type: 'wrong-type', // Would not be caught
  amount: 1000, // Wrong property name
};
```

---

## Best Practices

1. **Always unsubscribe** from observables in component `ngOnDestroy()`
2. **Use async pipe** in templates when possible to avoid manual subscription management
3. **Handle errors** gracefully and show user-friendly messages
4. **Use loading states** to provide feedback during API calls
5. **Cache data** when appropriate to reduce API calls
6. **Type everything** - use provided interfaces for all data

---

## Need Help?

- Check `API_DOCUMENTATION.md` for backend API details
- Review component examples in `app/` folder
- All services are registered in root, no need to provide in components
