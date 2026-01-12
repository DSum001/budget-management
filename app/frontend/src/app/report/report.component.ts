import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../services/report.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  selectedPeriod: 'daily' | 'weekly' | 'monthly' = 'monthly';
  report: any = null;
  loading = false;
  errorMessage = '';
  Math = Math;
  currentDate = new Date();

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.loading = true;
    this.errorMessage = '';

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    this.reportService.getDashboard(month, year).subscribe({
      next: (data: any) => {
        this.report = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'ไม่สามารถโหลดรายงานได้: ' + err.message;
        this.loading = false;
      },
    });
  }

  getTotalExpense(): number {
    if (!this.report || !this.report.byCategory) return 0;
    return this.report.byCategory.reduce((sum: number, item: any) => sum + item.total, 0);
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }

  getTrendHeight(value: number): number {
    if (!this.report || !this.report.trends) return 20;
    const max = Math.max(...this.report.trends.flatMap((t: any) => [t.income, t.expense]));
    return max > 0 ? Math.max(20, (value / max) * 150) : 20;
  }

  formatNumber(value: number): string {
    return value.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  formatShort(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toFixed(0);
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
