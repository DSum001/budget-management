# Personal Finance Management API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints (except auth) require JWT token in header:

```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response 201:
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "user": { ... },
  "token": "jwt_token"
}
```

### Get Profile

```http
GET /auth/profile
Authorization: Bearer <token>

Response 200:
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "defaultCurrency": "THB",
  "preferences": { ... }
}
```

---

## 👤 User Endpoints

### Update Profile

```http
PATCH /users/profile
Authorization: Bearer <token>

{
  "firstName": "John",
  "lastName": "Smith",
  "defaultCurrency": "USD"
}
```

### Update Preferences

```http
PATCH /users/preferences
{
  "language": "th",
  "theme": "dark",
  "notifications": true
}
```

---

## 💳 Account Endpoints

### List Accounts

```http
GET /accounts
GET /accounts?type=bank
GET /accounts?includeArchived=true

Response 200:
{
  "data": [
    {
      "id": "account_id",
      "name": "กระเป๋าเงินหลัก",
      "type": "cash",
      "balance": 5000,
      "currency": "THB",
      "includeInTotal": true
    }
  ],
  "total": 1
}
```

### Create Account

```http
POST /accounts
{
  "name": "ธนาคารกสิกร",
  "type": "bank",
  "balance": 10000,
  "currency": "THB",
  "bankName": "Kasikornbank",
  "accountNumber": "xxx-x-xxxxx-x",
  "color": "#4CAF50"
}
```

### Update Account

```http
PATCH /accounts/:id
{
  "name": "Updated name",
  "balance": 15000
}
```

### Delete Account

```http
DELETE /accounts/:id
```

### Get Account Summary

```http
GET /accounts/summary

Response 200:
{
  "totalBalance": 50000,
  "byType": {
    "cash": 5000,
    "bank": 40000,
    "e_wallet": 5000
  },
  "accounts": [ ... ]
}
```

---

## 🏷️ Category Endpoints

### List Categories

```http
GET /categories
GET /categories?type=expense
GET /categories?parentId=null  // main categories only

Response 200:
{
  "data": [
    {
      "id": "cat_id",
      "name": "อาหาร",
      "type": "expense",
      "parentId": null,
      "icon": "🍔",
      "color": "#FF5722",
      "subCategories": [
        {
          "id": "sub_cat_id",
          "name": "อาหารเช้า",
          "parentId": "cat_id"
        }
      ]
    }
  ]
}
```

### Create Category

```http
POST /categories
{
  "name": "อาหาร",
  "type": "expense",
  "parentId": null,
  "icon": "🍔",
  "color": "#FF5722"
}
```

### Update Category

```http
PATCH /categories/:id
{
  "name": "Updated name",
  "color": "#FF0000"
}
```

### Delete Category

```http
DELETE /categories/:id
// Note: Cannot delete if has transactions
```

### Initialize Default Categories

```http
POST /categories/initialize
// Creates default categories for new user
```

---

## 💰 Transaction Endpoints

### List Transactions

```http
GET /transactions
GET /transactions?type=expense
GET /transactions?categoryId=cat_id
GET /transactions?accountId=acc_id
GET /transactions?startDate=2024-01-01
GET /transactions?endDate=2024-01-31
GET /transactions?tags=shopping,food
GET /transactions?search=coffee
GET /transactions?page=1&limit=20
GET /transactions?sortBy=date&sortOrder=desc

Response 200:
{
  "data": [
    {
      "id": "txn_id",
      "type": "expense",
      "amount": 150,
      "date": "2024-01-15T10:30:00Z",
      "categoryId": "cat_id",
      "category": {
        "id": "cat_id",
        "name": "อาหาร",
        "icon": "🍔"
      },
      "accountId": "acc_id",
      "account": {
        "id": "acc_id",
        "name": "กระเป๋าเงิน"
      },
      "description": "กาแฟ Starbucks",
      "tags": ["coffee", "drink"],
      "isRecurring": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Get Transaction

```http
GET /transactions/:id
```

### Create Transaction

```http
POST /transactions
{
  "type": "expense",
  "amount": 150,
  "date": "2024-01-15T10:30:00Z",
  "categoryId": "cat_id",
  "accountId": "acc_id",
  "description": "กาแฟ Starbucks",
  "note": "ซื้อให้เพื่อนด้วย",
  "tags": ["coffee", "drink"],
  "isRecurring": false
}
```

### Create Recurring Transaction

```http
POST /transactions
{
  "type": "expense",
  "amount": 500,
  "date": "2024-01-01",
  "categoryId": "cat_id",
  "accountId": "acc_id",
  "description": "ค่าเน็ตประจำเดือน",
  "isRecurring": true,
  "recurringFrequency": "monthly",
  "recurringEndDate": "2024-12-31"
}
```

### Update Transaction

```http
PATCH /transactions/:id
{
  "amount": 200,
  "description": "Updated description"
}
```

### Delete Transaction

```http
DELETE /transactions/:id
```

### Bulk Delete

```http
POST /transactions/bulk-delete
{
  "ids": ["id1", "id2", "id3"]
}
```

### Transfer Between Accounts

```http
POST /transactions/transfer
{
  "amount": 5000,
  "fromAccountId": "acc1_id",
  "toAccountId": "acc2_id",
  "date": "2024-01-15",
  "description": "โอนเงินระหว่างบัญชี"
}
```

---

## 📊 Budget Endpoints

### List Budgets

```http
GET /budgets
GET /budgets?period=monthly
GET /budgets?isActive=true

Response 200:
{
  "data": [
    {
      "id": "budget_id",
      "name": "งบอาหารประจำเดือน",
      "categoryId": "cat_id",
      "category": {
        "name": "อาหาร"
      },
      "amount": 5000,
      "spent": 3500,
      "remaining": 1500,
      "percentage": 70,
      "period": "monthly",
      "startDate": "2024-01-01",
      "endDate": "2024-01-31",
      "alertEnabled": true,
      "alertThreshold": 80,
      "isOverBudget": false
    }
  ]
}
```

### Create Budget

```http
POST /budgets
{
  "name": "งบอาหารประจำเดือน",
  "categoryId": "cat_id",
  "amount": 5000,
  "period": "monthly",
  "startDate": "2024-01-01",
  "alertEnabled": true,
  "alertThreshold": 80
}
```

### Update Budget

```http
PATCH /budgets/:id
{
  "amount": 6000,
  "alertThreshold": 90
}
```

### Delete Budget

```http
DELETE /budgets/:id
```

### Check Budget Status

```http
GET /budgets/:id/status

Response 200:
{
  "budgetId": "budget_id",
  "amount": 5000,
  "spent": 4500,
  "remaining": 500,
  "percentage": 90,
  "isOverBudget": false,
  "shouldAlert": true,
  "daysLeft": 10
}
```

---

## 🎯 Saving Goal Endpoints

### List Goals

```http
GET /saving-goals
GET /saving-goals?status=active

Response 200:
{
  "data": [
    {
      "id": "goal_id",
      "name": "ซื้อรถยนต์",
      "targetAmount": 500000,
      "currentAmount": 150000,
      "progress": 30,
      "targetDate": "2025-12-31",
      "status": "active",
      "daysLeft": 365,
      "monthlyRequired": 11667
    }
  ]
}
```

### Create Goal

```http
POST /saving-goals
{
  "name": "ซื้อรถยนต์",
  "targetAmount": 500000,
  "currentAmount": 150000,
  "targetDate": "2025-12-31",
  "description": "Honda City"
}
```

### Update Goal Progress

```http
PATCH /saving-goals/:id/progress
{
  "amount": 10000,  // add to current amount
  "transactionId": "txn_id"  // optional: link to transaction
}
```

### Complete Goal

```http
POST /saving-goals/:id/complete
```

---

## 📈 Report Endpoints

### Dashboard Summary

```http
GET /reports/dashboard
GET /reports/dashboard?month=2024-01

Response 200:
{
  "overview": {
    "totalIncome": 50000,
    "totalExpense": 35000,
    "balance": 15000,
    "savingRate": 30
  },
  "byCategory": [
    {
      "categoryId": "cat_id",
      "categoryName": "อาหาร",
      "amount": 5000,
      "percentage": 14.3,
      "transactionCount": 45
    }
  ],
  "byAccount": [ ... ],
  "recentTransactions": [ ... ],
  "budgetAlerts": [ ... ]
}
```

### Income vs Expense Report

```http
GET /reports/income-expense
GET /reports/income-expense?startDate=2024-01-01&endDate=2024-12-31
GET /reports/income-expense?groupBy=month

Response 200:
{
  "period": "2024",
  "data": [
    {
      "period": "2024-01",
      "income": 50000,
      "expense": 35000,
      "balance": 15000
    }
  ],
  "total": {
    "income": 600000,
    "expense": 420000,
    "balance": 180000
  }
}
```

### Category Analysis

```http
GET /reports/category-analysis
GET /reports/category-analysis?type=expense
GET /reports/category-analysis?period=2024-01

Response 200:
{
  "type": "expense",
  "period": "2024-01",
  "categories": [
    {
      "categoryId": "cat_id",
      "categoryName": "อาหาร",
      "amount": 5000,
      "percentage": 20,
      "transactionCount": 45,
      "avgPerTransaction": 111.11,
      "trend": "up"  // compared to previous period
    }
  ],
  "total": 25000
}
```

### Monthly Trend

```http
GET /reports/trend
GET /reports/trend?months=6
GET /reports/trend?type=expense

Response 200:
{
  "months": [
    {
      "month": "2024-01",
      "income": 50000,
      "expense": 35000,
      "balance": 15000
    }
  ]
}
```

### Top Expenses

```http
GET /reports/top-expenses
GET /reports/top-expenses?limit=10
GET /reports/top-expenses?period=2024-01

Response 200:
{
  "period": "2024-01",
  "transactions": [
    {
      "id": "txn_id",
      "description": "MacBook Pro",
      "amount": 45000,
      "date": "2024-01-15",
      "category": "เทคโนโลยี"
    }
  ]
}
```

### Budget Performance

```http
GET /reports/budget-performance
GET /reports/budget-performance?period=2024-01

Response 200:
{
  "period": "2024-01",
  "budgets": [
    {
      "budgetId": "budget_id",
      "categoryName": "อาหาร",
      "budgeted": 5000,
      "spent": 4500,
      "remaining": 500,
      "performance": "good",  // good | warning | over
      "percentage": 90
    }
  ]
}
```

### Remaining Balance by Period

```http
GET /reports/remaining-balance
GET /reports/remaining-balance?period=daily
GET /reports/remaining-balance?period=weekly
GET /reports/remaining-balance?period=monthly
GET /reports/remaining-balance?startDate=2024-01-01&endDate=2024-01-31

Query Parameters:
- period: 'daily' | 'weekly' | 'monthly' (default: 'monthly')
- startDate: ISO date string (optional, overrides period calculation)
- endDate: ISO date string (optional, overrides period calculation)

Response 200:
{
  "period": "monthly",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.999Z",
  "summary": {
    "totalIncome": 50000,
    "totalExpense": 35000,
    "netAmount": 15000,
    "currentBalance": 100000
  },
  "expenseByCategory": [
    {
      "categoryId": "cat_id",
      "categoryName": "อาหาร",
      "categoryIcon": "🍔",
      "categoryColor": "#FF6B6B",
      "total": 8000,
      "count": 25
    }
  ],
  "budget": {
    "totalBudget": 40000,
    "totalSpent": 35000,
    "remaining": 5000,
    "percentage": 87.5
  },
  "accounts": [
    {
      "id": "acc_id",
      "name": "บัญชีเงินสด",
      "type": "cash",
      "balance": 50000
    }
  ]
}
```

### Expenses with Balance Calculation

```http
GET /reports/expenses-with-balance
GET /reports/expenses-with-balance?period=daily
GET /reports/expenses-with-balance?period=weekly
GET /reports/expenses-with-balance?period=monthly
GET /reports/expenses-with-balance?categoryId=cat_id
GET /reports/expenses-with-balance?accountId=acc_id
GET /reports/expenses-with-balance?startDate=2024-01-01&endDate=2024-01-31

Query Parameters:
- period: 'daily' | 'weekly' | 'monthly' (default: 'monthly')
- categoryId: filter by category
- accountId: filter by account
- startDate: ISO date string (optional)
- endDate: ISO date string (optional)

Response 200:
{
  "period": "monthly",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.999Z",
  "summary": {
    "totalIncome": 50000,
    "totalExpense": 35000,
    "remaining": 15000
  },
  "expenses": [
    {
      "id": "txn_id",
      "amount": 500,
      "description": "ค่าอาหาร",
      "date": "2024-01-15T10:30:00.000Z",
      "category": {
        "name": "อาหาร",
        "icon": "🍔",
        "color": "#FF6B6B"
      },
      "account": {
        "name": "บัญชีเงินสด",
        "type": "cash"
      },
      "note": "มื้อเที่ยง",
      "tags": ["lunch", "restaurant"]
    }
  ]
}
```

---

## 📤 Export Endpoints

### Export Transactions to CSV

```http
GET /export/transactions/csv
GET /export/transactions/csv?startDate=2024-01-01&endDate=2024-12-31
GET /export/transactions/csv?categoryId=cat_id

Response 200:
Content-Type: text/csv
Content-Disposition: attachment; filename="transactions_2024-01.csv"

[CSV file download]
```

### Export Report to CSV

```http
GET /export/report/csv?type=income-expense&year=2024
```

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["amount must be a positive number"],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Transaction not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```
