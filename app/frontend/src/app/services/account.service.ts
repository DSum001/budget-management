import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Account {
  _id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit_card' | 'e_wallet' | 'investment' | 'crypto';
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  includeInTotal: boolean;
  isArchived: boolean;
  institution?: string;
  accountNumber?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountSummary {
  totalBalance: number;
  byType: {
    type: string;
    total: number;
    count: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  getById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  getSummary(): Observable<AccountSummary> {
    return this.http.get<AccountSummary>(`${this.apiUrl}/summary`);
  }

  create(data: Partial<Account>): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Account>): Observable<Account> {
    return this.http.patch<Account>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
