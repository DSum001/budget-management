import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SavingGoalService } from '../services/saving-goal.service';
import { RouterLink } from '@angular/router';

export interface SavingGoal {
  _id?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  description?: string;
  isActive: boolean;
  priority?: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-saving-goal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './saving-goal.component.html',
  styleUrls: ['./saving-goal.component.css'],
})
export class SavingGoalComponent implements OnInit {
  goals: SavingGoal[] = [];
  showForm = false;
  showAddMoney = false;
  loading = false;
  errorMessage = '';
  editingGoal: SavingGoal | null = null;
  selectedGoal: SavingGoal | null = null;
  addAmount: number = 0;
  Math = Math;

  currentGoal: SavingGoal = this.getEmptyGoal();

  constructor(private savingGoalService: SavingGoalService) {}

  ngOnInit() {
    this.loadGoals();
  }

  loadGoals() {
    this.loading = true;
    this.errorMessage = '';

    this.savingGoalService.getAll().subscribe({
      next: (data: any) => {
        this.goals = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err: any) => {
        this.goals = [];
        this.errorMessage = 'ไม่สามารถโหลดข้อมูลเป้าหมายได้: ' + err.message;
        this.loading = false;
      },
    });
  }

  saveGoal() {
    this.loading = true;
    this.errorMessage = '';

    // Remove isActive and _id before sending to backend
    const { isActive, _id, ...goalData } = this.currentGoal;

    if (this.editingGoal && this.editingGoal._id) {
      this.savingGoalService.update(this.editingGoal._id, goalData).subscribe({
        next: () => {
          this.loadGoals();
          this.cancelEdit();
        },
        error: (err: any) => {
          this.errorMessage = 'ไม่สามารถอัพเดทเป้าหมายได้: ' + err.message;
          this.loading = false;
        },
      });
    } else {
      this.savingGoalService.create(goalData).subscribe({
        next: () => {
          this.loadGoals();
          this.cancelEdit();
        },
        error: (err: any) => {
          this.errorMessage = 'ไม่สามารถสร้างเป้าหมายได้: ' + err.message;
          this.loading = false;
        },
      });
    }
  }

  editGoal(goal: SavingGoal) {
    this.editingGoal = goal;
    this.currentGoal = { ...goal };
    this.showForm = true;
  }

  deleteGoal(id: string) {
    if (!confirm('คุณต้องการลบเป้าหมายนี้ใช่หรือไม่?')) {
      return;
    }

    this.loading = true;
    this.savingGoalService.delete(id).subscribe({
      next: () => {
        this.loadGoals();
      },
      error: (err: any) => {
        this.errorMessage = 'ไม่สามารถลบเป้าหมายได้: ' + err.message;
        this.loading = false;
      },
    });
  }

  showAddMoneyDialog(goal: SavingGoal) {
    this.selectedGoal = goal;
    this.addAmount = 0;
    this.showAddMoney = true;
  }

  closeAddMoneyDialog() {
    this.showAddMoney = false;
    this.selectedGoal = null;
    this.addAmount = 0;
  }

  addMoney() {
    if (!this.selectedGoal || !this.selectedGoal._id || this.addAmount <= 0) {
      return;
    }

    this.loading = true;
    const updatedGoal: SavingGoal = {
      ...this.selectedGoal,
      currentAmount: this.selectedGoal.currentAmount + this.addAmount,
    };

    this.savingGoalService.update(this.selectedGoal._id, updatedGoal).subscribe({
      next: () => {
        this.loadGoals();
        this.closeAddMoneyDialog();
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'ไม่สามารถเพิ่มเงินได้: ' + err.message;
        this.loading = false;
      },
    });
  }

  cancelEdit() {
    this.showForm = false;
    this.editingGoal = null;
    this.currentGoal = this.getEmptyGoal();
    this.loading = false;
  }

  getEmptyGoal(): SavingGoal {
    return {
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      isActive: true,
      priority: 'medium',
    };
  }

  get activeGoals(): SavingGoal[] {
    return Array.isArray(this.goals) ? this.goals.filter((g) => g.isActive) : [];
  }

  get totalTarget(): number {
    return this.activeGoals.reduce((sum, g) => sum + (g.targetAmount || 0), 0);
  }

  get totalSaved(): number {
    return this.activeGoals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);
  }

  getProgressPercentage(goal: SavingGoal): number {
    return goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      low: 'ต่ำ',
      medium: 'กลาง',
      high: 'สูง',
    };
    return labels[priority] || priority;
  }

  getDaysRemaining(targetDate: Date): number {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  isNearDeadline(targetDate: Date): boolean {
    const days = this.getDaysRemaining(targetDate);
    return days > 0 && days <= 30;
  }

  getDailyTarget(goal: SavingGoal): number {
    if (!goal.targetDate) return 0;
    const remaining = goal.targetAmount - goal.currentAmount;
    const days = this.getDaysRemaining(goal.targetDate);
    return days > 0 ? remaining / days : 0;
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
