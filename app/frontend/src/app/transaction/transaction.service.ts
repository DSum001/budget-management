import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Transaction {
  _id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  date: Date;
  description: string;
  note?: string;
  category: any;
  account: any;
  tags?: string[];
  location?: string;
  attachments?: string[];
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurringEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFilters {
  type?: string;
  categoryId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  tags?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TransactionResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {
    console.log('✅ TransactionService initialized');
    console.log('🔗 API URL:', this.apiUrl);
    console.log('🌍 Environment:', environment.production ? 'Production' : 'Development');
  }

  getAll(filters?: TransactionFilters): Observable<TransactionResponse> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<TransactionResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Transaction>): Observable<Transaction> {
    return this.http.patch<Transaction>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  bulkDelete(ids: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/bulk-delete`, { ids });
  }

  transfer(data: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    date: Date;
    description?: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/transfer`, data);
  }

  // Keep legacy methods for backward compatibility
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  addTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return this.create(transaction);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.delete(id);
  }
}
