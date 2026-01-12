import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Dashboard } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getDashboard(month?: number, year?: number): Observable<Dashboard> {
    let params = new HttpParams();
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());
    return this.http.get<Dashboard>(`${this.apiUrl}/dashboard`, { params });
  }

  getIncomeExpenseTrend(
    groupBy: 'day' | 'month' | 'year' = 'month',
    startDate?: string,
    endDate?: string
  ): Observable<any[]> {
    let params = new HttpParams().set('groupBy', groupBy);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<any[]>(`${this.apiUrl}/income-expense-trend`, { params });
  }

  getCategoryAnalysis(
    type: 'income' | 'expense' = 'expense',
    month?: number,
    year?: number
  ): Observable<any> {
    let params = new HttpParams().set('type', type);
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());
    return this.http.get<any>(`${this.apiUrl}/category-analysis`, { params });
  }

  getMonthlyTrend(months: number = 6): Observable<any[]> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<any[]>(`${this.apiUrl}/monthly-trend`, { params });
  }

  getTopExpenses(limit: number = 10, month?: number, year?: number): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());
    return this.http.get<any>(`${this.apiUrl}/top-expenses`, { params });
  }

  getBudgetPerformance(month?: number, year?: number): Observable<any> {
    let params = new HttpParams();
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());
    return this.http.get<any>(`${this.apiUrl}/budget-performance`, { params });
  }

  getAccountBalanceHistory(
    accountId: string,
    startDate?: string,
    endDate?: string
  ): Observable<any> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<any>(`${this.apiUrl}/account-balance-history/${accountId}`, { params });
  }

  getRemainingBalance(
    period: 'daily' | 'weekly' | 'monthly' = 'monthly',
    startDate?: string,
    endDate?: string
  ): Observable<any> {
    let params = new HttpParams().set('period', period);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<any>(`${this.apiUrl}/remaining-balance`, { params });
  }

  getExpensesWithBalance(filters: {
    period?: 'daily' | 'weekly' | 'monthly';
    categoryId?: string;
    accountId?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<any> {
    let params = new HttpParams();
    if (filters.period) params = params.set('period', filters.period);
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters.accountId) params = params.set('accountId', filters.accountId);
    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);
    return this.http.get<any>(`${this.apiUrl}/expenses-with-balance`, { params });
  }
}
