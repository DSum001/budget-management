import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { RouterLink } from '@angular/router';
import { Category } from '../models';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  showForm = false;
  loading = false;
  errorMessage = '';
  editingCategory: Category | null = null;
  activeTab: 'all' | 'income' | 'expense' = 'all';

  currentCategory: Partial<Category> = this.getEmptyCategory();

  constructor(private categoryService: CategoryService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.errorMessage = '';

    this.categoryService.getAll().subscribe({
      next: (data: Category[]) => {
        console.log('✅ Categories loaded:', data);
        this.categories = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error loading categories:', err);
        this.errorMessage =
          'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  saveCategory() {
    this.loading = true;
    this.errorMessage = '';

    // Remove isActive before sending to backend
    const { isActive, _id, ...categoryData } = this.currentCategory;

    if (this.editingCategory && this.editingCategory._id) {
      this.categoryService.update(this.editingCategory._id, categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelEdit();
        },
        error: (err: any) => {
          this.errorMessage = 'ไม่สามารถอัพเดทหมวดหมู่ได้: ' + err.message;
          this.loading = false;
        },
      });
    } else {
      this.categoryService.create(categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelEdit();
        },
        error: (err: any) => {
          this.errorMessage = 'ไม่สามารถสร้างหมวดหมู่ได้: ' + err.message;
          this.loading = false;
        },
      });
    }
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.currentCategory = { ...category };
    this.showForm = true;
  }

  deleteCategory(id: string) {
    if (!confirm('คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) {
      return;
    }

    this.loading = true;
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (err: any) => {
        this.errorMessage = 'ไม่สามารถลบหมวดหมู่ได้: ' + err.message;
        this.loading = false;
      },
    });
  }

  cancelEdit() {
    this.showForm = false;
    this.editingCategory = null;
    this.currentCategory = this.getEmptyCategory();
    this.loading = false;
  }

  getEmptyCategory(): Partial<Category> {
    return {
      name: '',
      type: 'expense',
      icon: '',
      color: '#667eea',
      description: '',
      isActive: true,
    };
  }

  get filteredCategories(): Category[] {
    if (this.activeTab === 'all') {
      return this.categories;
    }
    return this.categories.filter((c) => c.type === this.activeTab);
  }

  get incomeCategories(): Category[] {
    return this.categories.filter((c) => c.type === 'income');
  }

  get expenseCategories(): Category[] {
    return this.categories.filter((c) => c.type === 'expense');
  }
}
