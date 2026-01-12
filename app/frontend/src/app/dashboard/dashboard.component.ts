import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ReportService } from '../services/report.service';
import { AuthService } from '../services/auth.service';
import { Dashboard, User } from '../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
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
