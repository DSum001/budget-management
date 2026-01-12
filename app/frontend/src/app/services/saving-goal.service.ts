import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SavingGoal, GoalProgress } from '../models';

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
