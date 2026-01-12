import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Budget, BudgetStatus } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiUrl = `${environment.apiUrl}/budgets`;

  constructor(private http: HttpClient) {}

  getAll(period?: string): Observable<Budget[]> {
    let params: any = {};
    if (period) params.period = period;
    return this.http.get<Budget[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/${id}`);
  }

  getStatus(id: string): Observable<BudgetStatus> {
    return this.http.get<BudgetStatus>(`${this.apiUrl}/${id}/status`);
  }

  create(data: Partial<Budget>): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Budget>): Observable<Budget> {
    return this.http.patch<Budget>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
