import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from './transaction.service';
import { ReportService } from '../services/report.service';

export interface Transaction {
  _id?: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: number;
  description: string;
  date: Date;
  note?: string;
  tags?: string[];
  account?: any;
}

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

  newTransaction: Transaction = {
    type: 'income',
    category: '',
    amount: 0,
    description: '',
    date: new Date(),
  };

  incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
  expenseCategories = [
    'Food',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Other',
  ];

  constructor(
    private transactionService: TransactionService,
    private reportService: ReportService
  ) {
    console.log('TransactionComponent initialized');
  }

  ngOnInit() {
    console.log('ngOnInit called - loading transactions...');
    this.loadTransactions();
    this.loadRemainingBalance();
  }

  loadTransactions() {
    this.isLoading = true;
    this.errorMessage = '';

    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Unable to load data: ${
          err.message || 'Please check if the backend is running'
        }`;
        this.isLoading = false;
      },
    });
  }

  loadRemainingBalance() {
    this.reportService.getRemainingBalance(this.filterPeriod).subscribe({
      next: (data) => {
        this.remainingBalanceData = data;
      },
      error: (err) => {
        console.error('Error loading remaining balance:', err);
      },
    });
  }

  onPeriodChange() {
    this.loadRemainingBalance();
  }

  applyFilters() {
    let filtered = [...this.transactions];

    // Filter by type
    if (this.filterType !== 'all') {
      filtered = filtered.filter((t) => t.type === this.filterType);
    }

    // Filter by category
    if (this.filterCategory) {
      filtered = filtered.filter((t) => t.category === this.filterCategory);
    }

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(term) || t.category.toLowerCase().includes(term)
      );
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
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredTransactions = filtered;
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
    if (this.newTransaction.category && this.newTransaction.amount > 0) {
      this.transactionService.addTransaction(this.newTransaction).subscribe({
        next: (transaction) => {
          this.transactions.unshift(transaction);
          this.applyFilters();
          this.resetForm();
          this.showForm = false;
        },
        error: (err) => {
          console.error('Error adding transaction:', err);
          alert('Failed to add transaction. Please try again.');
        },
      });
    }
  }

  deleteTransaction(id: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.transactions = this.transactions.filter((t) => t._id !== id);
          this.applyFilters();
        },
        error: (err) => {
          console.error('Error deleting transaction:', err);
          alert('Failed to delete transaction. Please try again.');
        },
      });
    }
  }

  resetForm() {
    this.newTransaction = {
      type: 'income',
      category: '',
      amount: 0,
      description: '',
      date: new Date(),
    };
  }

  get currentCategories() {
    return this.newTransaction.type === 'income' ? this.incomeCategories : this.expenseCategories;
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
    const categories = new Set(this.transactions.map((t) => t.category));
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
