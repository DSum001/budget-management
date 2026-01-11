import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ReportService, Dashboard } from '../services/report.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>Dashboard</h1>
          @if (currentUser) {
          <div class="user-info">
            <span>Hello, {{ currentUser.firstName || currentUser.email }}</span>
            <button (click)="logout()" class="btn-logout">Logout</button>
          </div>
          }
        </div>
      </header>

      <nav class="dashboard-nav">
        <a
          routerLink="/dashboard"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          >Dashboard</a
        >
        <a routerLink="/transactions" routerLinkActive="active">Transactions</a>
        <a routerLink="/accounts" routerLinkActive="active">Accounts</a>
        <a routerLink="/budgets" routerLinkActive="active">Budgets</a>
        <a routerLink="/goals" routerLinkActive="active">Savings Goals</a>
        <a routerLink="/reports" routerLinkActive="active">Reports</a>
      </nav>

      <div class="dashboard-content">
        @if (loading) {
        <div class="loading">Loading data...</div>
        } @else if (error) {
        <div class="error">{{ error }}</div>
        } @else if (dashboard) {
        <div class="overview-cards">
          <div class="card income-card">
            <div class="card-icon">💰</div>
            <div class="card-content">
              <h3>Income</h3>
              <p class="amount">฿{{ formatNumber(dashboard.overview.income) }}</p>
              <span class="period">This Month</span>
            </div>
          </div>

          <div class="card expense-card">
            <div class="card-icon">💸</div>
            <div class="card-content">
              <h3>Expenses</h3>
              <p class="amount">฿{{ formatNumber(dashboard.overview.expense) }}</p>
              <span class="period">This Month</span>
            </div>
          </div>

          <div class="card balance-card">
            <div class="card-icon">💵</div>
            <div class="card-content">
              <h3>Balance</h3>
              <p class="amount" [class.negative]="dashboard.overview.balance < 0">
                ฿{{ formatNumber(dashboard.overview.balance) }}
              </p>
              <span class="period">This Month</span>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="section">
            <h2>Expenses by Category</h2>
            @if (dashboard.byCategory.length > 0) {
            <div class="category-list">
              @for (item of dashboard.byCategory.slice(0, 5); track item.categoryId) {
              <div class="category-item">
                <span class="category-name">{{ item.categoryName || 'Unspecified' }}</span>
                <span class="category-amount">฿{{ formatNumber(item.total) }}</span>
              </div>
              }
            </div>
            } @else {
            <p class="empty-state">No transactions yet</p>
            }
          </div>

          <div class="section">
            <h2>Transactions by Account</h2>
            @if (dashboard.byAccount.length > 0) {
            <div class="account-list">
              @for (item of dashboard.byAccount.slice(0, 5); track item.accountId) {
              <div class="account-item">
                <span class="account-name">{{ item.accountName || 'Unspecified' }}</span>
                <span class="account-amount">฿{{ formatNumber(item.total) }}</span>
              </div>
              }
            </div>
            } @else {
            <p class="empty-state">No transactions yet</p>
            }
          </div>
        </div>

        <div class="section">
          <h2>Recent Transactions</h2>
          @if (dashboard.recentTransactions.length > 0) {
          <div class="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                @for (tx of dashboard.recentTransactions; track tx._id) {
                <tr>
                  <td>{{ formatDate(tx.date) }}</td>
                  <td>
                    <span class="badge" [class]="tx.type">
                      {{ tx.type === 'income' ? 'Income' : 'Expense' }}
                    </span>
                  </td>
                  <td>{{ tx.category?.name || '-' }}</td>
                  <td>{{ tx.description }}</td>
                  <td class="amount" [class]="tx.type">
                    {{ tx.type === 'income' ? '+' : '-' }}฿{{ formatNumber(tx.amount) }}
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="view-all">
            <a routerLink="/transactions" class="btn-link">View All →</a>
          </div>
          } @else {
          <p class="empty-state">No transactions yet</p>
          }
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        min-height: 100vh;
        background: #f5f7fa;
      }

      .dashboard-header {
        background: white;
        border-bottom: 1px solid #e1e8ed;
        padding: 20px 40px;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1400px;
        margin: 0 auto;
      }

      h1 {
        margin: 0;
        color: #333;
        font-size: 24px;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .btn-logout {
        padding: 8px 16px;
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
      }

      .dashboard-nav {
        background: white;
        border-bottom: 1px solid #e1e8ed;
        padding: 0 40px;
        display: flex;
        gap: 32px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .dashboard-nav a {
        padding: 16px 0;
        color: #666;
        text-decoration: none;
        border-bottom: 2px solid transparent;
        transition: all 0.3s;
      }

      .dashboard-nav a:hover {
        color: #667eea;
      }

      .dashboard-nav a.active {
        color: #667eea;
        border-bottom-color: #667eea;
      }

      .dashboard-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px;
      }

      .loading,
      .error {
        text-align: center;
        padding: 60px 20px;
        font-size: 16px;
      }

      .error {
        color: #c33;
      }

      .overview-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
        margin-bottom: 40px;
      }

      .card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .card-icon {
        font-size: 40px;
      }

      .card-content h3 {
        margin: 0 0 8px 0;
        color: #666;
        font-size: 14px;
        font-weight: 500;
      }

      .card-content .amount {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        color: #333;
      }

      .amount.negative {
        color: #ff4444;
      }

      .card-content .period {
        font-size: 12px;
        color: #999;
      }

      .income-card {
        border-left: 4px solid #4caf50;
      }

      .expense-card {
        border-left: 4px solid #ff9800;
      }

      .balance-card {
        border-left: 4px solid #667eea;
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 24px;
        margin-bottom: 40px;
      }

      .section {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .section h2 {
        margin: 0 0 20px 0;
        font-size: 18px;
        color: #333;
      }

      .category-list,
      .account-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .category-item,
      .account-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 6px;
      }

      .category-name,
      .account-name {
        color: #333;
        font-weight: 500;
      }

      .category-amount,
      .account-amount {
        color: #667eea;
        font-weight: 600;
      }

      .transactions-table {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        text-align: left;
        padding: 12px;
        color: #666;
        font-weight: 600;
        font-size: 14px;
        border-bottom: 2px solid #e1e8ed;
      }

      td {
        padding: 12px;
        color: #333;
        border-bottom: 1px solid #f0f0f0;
      }

      .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }

      .badge.income {
        background: #e8f5e9;
        color: #4caf50;
      }

      .badge.expense {
        background: #fff3e0;
        color: #ff9800;
      }

      td.amount {
        font-weight: 600;
      }

      td.amount.income {
        color: #4caf50;
      }

      td.amount.expense {
        color: #ff9800;
      }

      .view-all {
        margin-top: 16px;
        text-align: center;
      }

      .btn-link {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
      }

      .btn-link:hover {
        text-decoration: underline;
      }

      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #999;
      }

      @media (max-width: 768px) {
        .dashboard-header,
        .dashboard-nav,
        .dashboard-content {
          padding-left: 20px;
          padding-right: 20px;
        }

        .dashboard-nav {
          overflow-x: auto;
        }

        .dashboard-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  dashboard: Dashboard | null = null;
  currentUser: User | null = null;
  loading = true;
  error = '';

  constructor(private reportService: ReportService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.loadDashboard();
  }

  loadDashboard(): void {
    const now = new Date();
    this.reportService.getDashboard(now.getMonth() + 1, now.getFullYear()).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Unable to load data';
        this.loading = false;
        console.error('Error loading dashboard:', err);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }

  formatNumber(num: number): string {
    return num.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
