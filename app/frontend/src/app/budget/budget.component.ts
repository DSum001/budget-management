import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../services/budget.service';
import { CategoryService } from '../services/category.service';
import { RouterLink } from '@angular/router';

export interface Budget {
  _id?: string;
  name: string;
  amount: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  categoryId?: string;
  categoryName?: string;
  isActive: boolean;
  alertThreshold?: number;
}

export interface Category {
  _id: string;
  name: string;
  type: string;
  icon?: string;
  color?: string;
}

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
})
export class BudgetComponent implements OnInit {
  budgets: Budget[] = [];
  categories: Category[] = [];
  showForm = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  editingBudget: Budget | null = null;
  Math = Math;

  currentBudget: Budget = this.getEmptyBudget();

  constructor(
    private budgetService: BudgetService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBudgets();
    this.loadCategories();
  }

  loadBudgets() {
    this.loading = true;
    this.errorMessage = '';
    console.log('🔄 Loading budgets...');

    this.budgetService.getAll().subscribe({
      next: (data: any) => {
        console.log('✅ Budgets loaded:', data);
        this.budgets = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error loading budgets:', err);
        this.errorMessage =
          'ไม่สามารถโหลดข้อมูลงบประมาณได้: ' + (err.error?.message || err.message);
        this.budgets = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data: any) => {
        console.log('✅ Categories loaded for budget:', data);
        this.categories = Array.isArray(data) ? data : [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error loading categories:', err);
        this.categories = [];
        this.cdr.detectChanges();
      },
      complete: () => {
        this.cdr.detectChanges();
      },
    });
  }

  saveBudget() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editingBudget && this.editingBudget._id) {
      // For update, send only modified fields with proper date formatting
      const updateData: any = {
        name: this.currentBudget.name,
        amount: this.currentBudget.amount,
        period: this.currentBudget.period,
        startDate: new Date(this.currentBudget.startDate).toISOString(),
        // isActive is managed by backend, don't send it
      };

      if (this.currentBudget.endDate) {
        updateData.endDate = new Date(this.currentBudget.endDate).toISOString();
      }
      if (this.currentBudget.categoryId && this.currentBudget.categoryId.trim() !== '') {
        updateData.categoryId = this.currentBudget.categoryId;
      }
      if (this.currentBudget.alertThreshold && this.currentBudget.alertThreshold > 0) {
        updateData.alertThreshold = this.currentBudget.alertThreshold;
      }

      this.budgetService.update(this.editingBudget._id, updateData).subscribe({
        next: () => {
          this.successMessage = 'อัพเดทงบประมาณสำเร็จ';
          this.loadBudgets();
          this.cancelEdit();
          this.cdr.detectChanges();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err: any) => {
          this.errorMessage = 'ไม่สามารถอัพเดทงบประมาณได้: ' + (err.error?.message || err.message);
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      // For create, send only required properties with proper date formatting
      const budgetData: any = {
        name: this.currentBudget.name,
        amount: this.currentBudget.amount,
        period: this.currentBudget.period,
        startDate: new Date(this.currentBudget.startDate).toISOString(),
      };

      // Add optional fields only if they exist and are not empty
      if (this.currentBudget.endDate) {
        budgetData.endDate = new Date(this.currentBudget.endDate).toISOString();
      }
      if (this.currentBudget.categoryId && this.currentBudget.categoryId.trim() !== '') {
        budgetData.categoryId = this.currentBudget.categoryId;
      }
      if (this.currentBudget.alertThreshold && this.currentBudget.alertThreshold > 0) {
        budgetData.alertThreshold = this.currentBudget.alertThreshold;
      }

      this.budgetService.create(budgetData).subscribe({
        next: () => {
          this.successMessage = 'สร้างงบประมาณสำเร็จ';
          this.loadBudgets();
          this.cancelEdit();
          this.cdr.detectChanges();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err: any) => {
          this.errorMessage = 'ไม่สามารถสร้างงบประมาณได้: ' + (err.error?.message || err.message);
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  editBudget(budget: Budget) {
    this.editingBudget = { ...budget };
    this.currentBudget = { ...budget };
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteBudget(id: string, budgetName: string) {
    if (!confirm(`คุณต้องการลบงบประมาณ "${budgetName}" ใช่หรือไม่?`)) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.budgetService.delete(id).subscribe({
      next: () => {
        this.successMessage = `ลบงบประมาณ "${budgetName}" สำเร็จ`;
        this.loadBudgets();
        this.cdr.detectChanges();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err: any) => {
        this.errorMessage = 'ไม่สามารถลบงบประมาณได้: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  cancelEdit() {
    this.showForm = false;
    this.editingBudget = null;
    this.currentBudget = this.getEmptyBudget();
    this.loading = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  getEmptyBudget(): Budget {
    return {
      name: '',
      amount: 0,
      spent: 0, // Will be set by backend
      period: 'monthly',
      startDate: new Date(),
      isActive: true, // Will be set by backend
    };
  }

  get totalBudget(): number {
    return this.budgets.filter((b) => b.isActive).reduce((sum, b) => sum + b.amount, 0);
  }

  get totalSpent(): number {
    return this.budgets.filter((b) => b.isActive).reduce((sum, b) => sum + b.spent, 0);
  }

  get totalRemaining(): number {
    return this.totalBudget - this.totalSpent;
  }

  getProgressPercentage(budget: Budget): number {
    return budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
  }

  getPeriodLabel(period: string): string {
    const labels: { [key: string]: string } = {
      daily: 'รายวัน',
      weekly: 'รายสัปดาห์',
      monthly: 'รายเดือน',
      yearly: 'รายปี',
      custom: 'กำหนดเอง',
    };
    return labels[period] || period;
  }

  formatNumber(value: number): string {
    return value.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
