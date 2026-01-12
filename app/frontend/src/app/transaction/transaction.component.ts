import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../services/transaction.service';
import { ReportService } from '../services/report.service';
import { CategoryService } from '../services/category.service';
import { AccountService } from '../services/account.service';
import { Category, Account, Transaction } from '../models';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  categories: Category[] = [];
  accounts: Account[] = [];
  showForm = false;
  isLoading = false;
  errorMessage = '';

  filterType: 'all' | 'income' | 'expense' = 'all';
  filterCategory = '';
  searchTerm = '';
  sortBy: 'date' | 'amount' | 'category' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Period filter for remaining balance
  filterPeriod: 'daily' | 'weekly' | 'monthly' = 'monthly';
  remainingBalanceData: any = null;

  currentPage = 1;
  itemsPerPage = 10;

  newTransaction: Partial<Transaction> = {
    type: 'income',
    category: null,
    categoryId: '',
    account: null,
    accountId: '',
    amount: 0,
    description: '',
    date: new Date(),
  };

  constructor(
    private transactionService: TransactionService,
    private reportService: ReportService,
    private categoryService: CategoryService,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Initialize with default values to prevent UI blocking
    this.remainingBalanceData = {
      summary: {
        totalIncome: 0,
        totalExpense: 0,
        netAmount: 0,
      },
    };

    this.loadCategories();
    this.loadAccounts();
    this.loadTransactions();
    this.loadRemainingBalance();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data: Category[]) => {
        this.categories = Array.isArray(data) ? data : [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.categories = [];
        this.errorMessage = 'Failed to load categories';
        this.cdr.detectChanges();
      },
    });
  }

  loadAccounts() {
    this.accountService.getAll().subscribe({
      next: (data: Account[]) => {
        this.accounts = Array.isArray(data) ? data : [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.accounts = [];
        this.errorMessage = 'Failed to load accounts';
        this.cdr.detectChanges();
      },
    });
  }

  loadTransactions() {
    this.isLoading = true;
    this.errorMessage = '';

    this.transactionService.getTransactions().subscribe({
      next: (data: Transaction[]) => {
        try {
          this.transactions = Array.isArray(data) ? data : [];
          this.applyFilters();
        } catch (error) {
          this.errorMessage = 'Error processing transactions';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.transactions = [];
        this.filteredTransactions = [];
        this.errorMessage = `Unable to load data: ${
          err.error?.message || err.message || 'Please check if the backend is running'
        }`;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadRemainingBalance() {
    // Don't block the UI if this fails
    this.reportService.getRemainingBalance(this.filterPeriod).subscribe({
      next: (data) => {
        this.remainingBalanceData = data;
        this.cdr.detectChanges();
      },
      error: () => {
        // Set default values to prevent UI issues
        this.remainingBalanceData = {
          summary: {
            totalIncome: 0,
            totalExpense: 0,
            netAmount: 0,
          },
        };
        this.cdr.detectChanges();
      },
    });
  }

  onPeriodChange() {
    this.loadRemainingBalance();
  }

  applyFilters() {
    try {
      if (!Array.isArray(this.transactions)) {
        this.filteredTransactions = [];
        return;
      }

      let filtered = [...this.transactions];

      // Filter by type
      if (this.filterType !== 'all') {
        filtered = filtered.filter((t) => t.type === this.filterType);
      }

      // Filter by category
      if (this.filterCategory) {
        filtered = filtered.filter((t) => {
          const categoryName = typeof t.category === 'string' ? t.category : t.category?.name;
          return categoryName === this.filterCategory;
        });
      }

      // Search filter
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter((t) => {
          const categoryName = typeof t.category === 'string' ? t.category : t.category?.name || '';
          return (
            t.description?.toLowerCase().includes(term) || categoryName.toLowerCase().includes(term)
          );
        });
      }

      // Sort
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (this.sortBy) {
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'amount':
            comparison = a.amount - b.amount;
            break;
          case 'category':
            const catA = typeof a.category === 'string' ? a.category : a.category?.name || '';
            const catB = typeof b.category === 'string' ? b.category : b.category?.name || '';
            comparison = catA.localeCompare(catB);
            break;
        }

        return this.sortOrder === 'asc' ? comparison : -comparison;
      });

      this.filteredTransactions = filtered;
    } catch (error) {
      this.filteredTransactions = [];
    }
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  setSortBy(field: 'date' | 'amount' | 'category') {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'desc';
    }
    this.applyFilters();
  }

  clearFilters() {
    this.filterType = 'all';
    this.filterCategory = '';
    this.searchTerm = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  onSubmit() {
    if (
      this.newTransaction.category &&
      this.newTransaction.amount &&
      this.newTransaction.amount > 0
    ) {
      this.isLoading = true;
      this.transactionService.addTransaction(this.newTransaction).subscribe({
        next: (transaction: Transaction) => {
          this.transactions.unshift(transaction);
          this.applyFilters();
          this.resetForm();
          this.showForm = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to add transaction: ' + (err.error?.message || err.message);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  deleteTransaction(id: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.isLoading = true;
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.transactions = this.transactions.filter((t) => t._id !== id);
          this.applyFilters();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.errorMessage =
            'Failed to delete transaction: ' + (err.error?.message || err.message);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  resetForm() {
    this.newTransaction = {
      type: 'income',
      category: null,
      categoryId: '',
      account: null,
      accountId: '',
      amount: 0,
      description: '',
      date: new Date(),
    };
  }

  get currentCategories() {
    return this.categories.filter((c) => c.type === this.newTransaction.type);
  }

  get incomeCategories() {
    return this.categories.filter((c) => c.type === 'income');
  }

  get expenseCategories() {
    return this.categories.filter((c) => c.type === 'expense');
  }

  get totalIncome() {
    return this.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get totalExpense() {
    return this.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get balance() {
    return this.totalIncome - this.totalExpense;
  }

  get allCategories(): string[] {
    const categories = new Set(
      this.transactions.map((t) => t.category?.name || t.category).filter(Boolean)
    );
    return Array.from(categories).sort();
  }

  get paginatedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTransactions.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get transactionStats() {
    return {
      total: this.filteredTransactions.length,
      avgIncome:
        this.totalIncome / (this.transactions.filter((t) => t.type === 'income').length || 1),
      avgExpense:
        this.totalExpense / (this.transactions.filter((t) => t.type === 'expense').length || 1),
      incomeCount: this.transactions.filter((t) => t.type === 'income').length,
      expenseCount: this.transactions.filter((t) => t.type === 'expense').length,
    };
  }

  get periodLabel() {
    switch (this.filterPeriod) {
      case 'daily':
        return ' Daily';
      case 'weekly':
        return ' Weekly';
      case 'monthly':
        return ' Monthly';
      default:
        return '';
    }
  }

  get periodIncome() {
    return this.remainingBalanceData?.summary?.totalIncome || 0;
  }

  get periodExpense() {
    return this.remainingBalanceData?.summary?.totalExpense || 0;
  }

  get periodRemaining() {
    return this.remainingBalanceData?.summary?.netAmount || 0;
  }
}
