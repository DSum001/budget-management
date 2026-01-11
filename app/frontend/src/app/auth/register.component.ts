import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h1>สมัครสมาชิก</h1>
        <p class="subtitle">สร้างบัญชีใหม่</p>

        @if (error) {
        <div class="error-message">{{ error }}</div>
        }

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">ชื่อ</label>
              <input
                type="text"
                id="firstName"
                [(ngModel)]="firstName"
                name="firstName"
                placeholder="ชื่อ"
              />
            </div>

            <div class="form-group">
              <label for="lastName">นามสกุล</label>
              <input
                type="text"
                id="lastName"
                [(ngModel)]="lastName"
                name="lastName"
                placeholder="นามสกุล"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">อีเมล *</label>
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
            <label for="password">รหัสผ่าน *</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              required
              minlength="6"
              placeholder="••••••••"
            />
            <small>รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</small>
          </div>

          <div class="form-group">
            <label for="confirmPassword">ยืนยันรหัสผ่าน *</label>
            <input
              type="password"
              id="confirmPassword"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              required
              placeholder="••••••••"
            />
            @if (confirmPassword && password !== confirmPassword) {
            <small class="error-text">รหัสผ่านไม่ตรงกัน</small>
            }
          </div>

          <button
            type="submit"
            class="btn-primary"
            [disabled]="!registerForm.form.valid || password !== confirmPassword || loading"
          >
            {{ loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก' }}
          </button>
        </form>

        <div class="login-link">มีบัญชีแล้ว? <a routerLink="/login">เข้าสู่ระบบ</a></div>
      </div>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
      }

      .register-card {
        background: white;
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
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

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
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

      small {
        display: block;
        margin-top: 4px;
        color: #666;
        font-size: 12px;
      }

      small.error-text {
        color: #c33;
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
        margin-top: 8px;
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .login-link {
        text-align: center;
        margin-top: 24px;
        color: #666;
        font-size: 14px;
      }

      .login-link a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
      }

      .login-link a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.error = 'รหัสผ่านไม่ตรงกัน';
      return;
    }

    this.loading = true;
    this.error = '';

    const data = {
      email: this.email,
      password: this.password,
      ...(this.firstName && { firstName: this.firstName }),
      ...(this.lastName && { lastName: this.lastName }),
    };

    this.authService.register(data).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
      },
    });
  }
}
