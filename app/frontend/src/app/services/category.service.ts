import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, CategoryTree } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(type?: 'income' | 'expense'): Observable<Category[]> {
    let params: any = {};
    if (type) params.type = type;
    return this.http.get<Category[]>(this.apiUrl, { params });
  }

  getTree(type?: 'income' | 'expense'): Observable<CategoryTree[]> {
    let params: any = {};
    if (type) params.type = type;
    return this.http.get<CategoryTree[]>(`${this.apiUrl}/tree`, { params });
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  initializeDefaults(): Observable<Category[]> {
    return this.http.post<Category[]>(`${this.apiUrl}/initialize`, {});
  }
}
