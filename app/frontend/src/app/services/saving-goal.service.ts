import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SavingGoal {
  _id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  linkedAccountId?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalProgress {
  targetAmount: number;
  currentAmount: number;
  remaining: number;
  progressPercentage: number;
  daysLeft: number;
  monthlyRequired: number;
  isOverdue: boolean;
  isCompleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SavingGoalService {
  private apiUrl = `${environment.apiUrl}/saving-goals`;

  constructor(private http: HttpClient) {}

  getAll(status?: string): Observable<SavingGoal[]> {
    let params: any = {};
    if (status) params.status = status;
    return this.http.get<SavingGoal[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<SavingGoal> {
    return this.http.get<SavingGoal>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<SavingGoal>): Observable<SavingGoal> {
    return this.http.post<SavingGoal>(this.apiUrl, data);
  }

  update(id: string, data: Partial<SavingGoal>): Observable<SavingGoal> {
    return this.http.patch<SavingGoal>(`${this.apiUrl}/${id}`, data);
  }

  updateProgress(id: string, amount: number, note?: string): Observable<SavingGoal> {
    return this.http.patch<SavingGoal>(`${this.apiUrl}/${id}/progress`, { amount, note });
  }

  complete(id: string): Observable<SavingGoal> {
    return this.http.post<SavingGoal>(`${this.apiUrl}/${id}/complete`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
