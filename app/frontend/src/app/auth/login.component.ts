import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>เข้าสู่ระบบ</h1>
        <p class="subtitle">Budget Management System</p>

        @if (error) {
        <div class="error-message">{{ error }}</div>
        }

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">อีเมล</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              required
              email
              placeholder="your@email.com"
            />
          </div>

          <div class="form-group">
            <label for="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              required
              minlength="6"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" class="btn-primary" [disabled]="!loginForm.form.valid || loading">
            {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
          </button>
        </form>

        <div class="register-link">ยังไม่มีบัญชี? <a routerLink="/register">สมัครสมาชิก</a></div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
      }

      .login-card {
        background: white;
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
      }

      h1 {
        margin: 0 0 8px 0;
        color: #333;
        font-size: 28px;
        text-align: center;
      }

      .subtitle {
        margin: 0 0 32px 0;
        color: #666;
        text-align: center;
        font-size: 14px;
      }

      .error-message {
        background: #fee;
        color: #c33;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 20px;
        font-size: 14px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      label {
        display: block;
        margin-bottom: 6px;
        color: #333;
        font-weight: 500;
        font-size: 14px;
      }

      input {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.3s;
        box-sizing: border-box;
      }

      input:focus {
        outline: none;
        border-color: #667eea;
      }

      .btn-primary {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s;
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .register-link {
        text-align: center;
        margin-top: 24px;
        color: #666;
        font-size: 14px;
      }

      .register-link a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
      }

      .register-link a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
      },
    });
  }
}
