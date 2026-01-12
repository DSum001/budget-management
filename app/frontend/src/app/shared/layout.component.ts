import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="app-layout">
      <header class="app-header">
        <div class="header-content">
          <div class="logo">
            <div class="logo-icon-wrapper">
              <span class="logo-icon">💰</span>
            </div>
            <div class="logo-text">
              <h1>Budget Manager</h1>
              <p class="tagline">จัดการเงินอย่างชาญฉลาด</p>
            </div>
          </div>
          @if (currentUser) {
          <div class="user-menu">
            <div class="user-avatar">
              {{ getUserInitial() }}
            </div>
            <div class="user-details">
              <span class="user-name">{{ currentUser.firstName || 'User' }}</span>
              <span class="user-email">{{ currentUser.email }}</span>
            </div>
            <button (click)="logout()" class="btn-logout">
              <span>ออกจากระบบ</span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
          }
        </div>
      </header>

      <div class="app-container">
        <nav class="app-sidebar">
          <div class="nav-content">
            <a
              routerLink="/dashboard"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="nav-link"
            >
              <svg
                class="nav-icon"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Dashboard</span>
            </a>

            <a routerLink="/transactions" routerLinkActive="active" class="nav-link">
              <svg
                class="nav-icon"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span>รายการ</span>
            </a>

            <a routerLink="/accounts" routerLinkActive="active" class="nav-link">
              <svg
                class="nav-icon"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
              <span>บัญชี</span>
            </a>

            <a routerLink="/budgets" routerLinkActive="active" class="nav-link">
              <svg
                class="nav-icon"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>งบประมาณ</span>
            </a>

            <a routerLink="/goals" routerLinkActive="active" class="nav-link">
              <svg
                class="nav-icon"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span>เป้าหมาย</span>
            </a>

            <a routerLink="/categories" routerLinkActive="active" class="nav-link">
              <svg
                class="nav-icon"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>หมวดหมู่</span>
            </a>

            <a routerLink="/reports" routerLinkActive="active" class="nav-link">
              <svg
                class="nav-icon"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span>รายงาน</span>
            </a>
          </div>
        </nav>

        <main class="app-main">
          <div class="main-content">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .app-layout {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        flex-direction: column;
      }

      /* Header Styles */
      .app-header {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1400px;
        margin: 0 auto;
        padding: 1rem 2rem;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .logo-icon-wrapper {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      .logo-icon {
        font-size: 28px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }

      .logo-text h1 {
        margin: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -0.5px;
      }

      .tagline {
        margin: 0;
        font-size: 0.75rem;
        color: #718096;
        font-weight: 500;
      }

      /* User Menu */
      .user-menu {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem 1rem;
        background: white;
        border-radius: 50px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 1rem;
      }

      .user-details {
        display: flex;
        flex-direction: column;
      }

      .user-name {
        font-size: 0.875rem;
        font-weight: 600;
        color: #2d3748;
      }

      .user-email {
        font-size: 0.75rem;
        color: #718096;
      }

      .btn-logout {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(245, 101, 101, 0.3);
      }

      .btn-logout:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);
      }

      /* Container and Sidebar */
      .app-container {
        display: flex;
        flex: 1;
        max-width: 1400px;
        margin: 2rem auto;
        padding: 0 2rem;
        gap: 2rem;
        width: 100%;
      }

      .app-sidebar {
        width: 260px;
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        position: sticky;
        top: 100px;
        height: fit-content;
        transition: all 0.3s ease;
      }

      .nav-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.875rem 1rem;
        color: #4a5568;
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.3s ease;
        font-size: 0.9375rem;
        font-weight: 500;
        position: relative;
        overflow: hidden;
      }

      .nav-link::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .nav-link:hover {
        background: linear-gradient(
          135deg,
          rgba(102, 126, 234, 0.1) 0%,
          rgba(118, 75, 162, 0.1) 100%
        );
        color: #667eea;
        transform: translateX(4px);
      }

      .nav-link:hover::before {
        transform: translateX(0);
      }

      .nav-link.active {
        background: linear-gradient(
          135deg,
          rgba(102, 126, 234, 0.15) 0%,
          rgba(118, 75, 162, 0.15) 100%
        );
        color: #667eea;
        font-weight: 600;
      }

      .nav-link.active::before {
        transform: translateX(0);
      }

      .nav-icon {
        width: 20px;
        height: 20px;
        stroke: currentColor;
        transition: all 0.3s ease;
      }

      .nav-link:hover .nav-icon,
      .nav-link.active .nav-icon {
        transform: scale(1.1);
      }

      /* Main Content */
      .app-main {
        flex: 1;
        min-height: 600px;
      }

      .main-content {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        min-height: 100%;
        animation: fadeIn 0.5s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .app-container {
          flex-direction: column;
        }

        .app-sidebar {
          width: 100%;
          position: static;
        }

        .nav-content {
          flex-direction: row;
          overflow-x: auto;
          gap: 0.25rem;
        }

        .nav-link {
          white-space: nowrap;
        }
      }

      @media (max-width: 768px) {
        .header-content {
          padding: 1rem;
        }

        .logo-text h1 {
          font-size: 1.25rem;
        }

        .tagline {
          display: none;
        }

        .user-details {
          display: none;
        }

        .app-container {
          margin: 1rem auto;
          padding: 0 1rem;
        }

        .main-content {
          padding: 1.5rem;
        }
      }
    `,
  ],
})
export class LayoutComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  getUserInitial(): string {
    if (this.currentUser?.firstName) {
      return this.currentUser.firstName.charAt(0).toUpperCase();
    }
    if (this.currentUser?.email) {
      return this.currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  }

  logout() {
    this.authService.logout();
  }
}
