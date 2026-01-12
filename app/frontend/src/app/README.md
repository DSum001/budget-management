# Frontend Application Structure

โครงสร้างโปรเจกต์ Frontend (Angular 21) สำหรับระบบจัดการงบประมาณ

## 📁 โครงสร้างหลัก

```
src/app/
├── 🎯 Feature Modules (หน้าจอหลัก)
│   ├── account/         - จัดการบัญชีการเงิน (บัญชีธนาคาร, เงินสด, บัตรเครดิต)
│   ├── auth/            - ระบบ Authentication (Login, Register)
│   ├── budget/          - จัดการงบประมาณและติดตามการใช้จ่าย
│   ├── category/        - จัดการหมวดหมู่รายรับ-รายจ่าย
│   ├── dashboard/       - แดชบอร์ดแสดงภาพรวมการเงิน
│   ├── report/          - รายงานและวิเคราะห์ข้อมูลการเงิน
│   ├── saving-goal/     - เป้าหมายการออม
│   └── transaction/     - จัดการรายการธุรกรรม
│
├── 🛠️ Core Infrastructure
│   ├── core/            - ฟังก์ชันและค่าคงที่หลัก
│   │   ├── constants/   - Constants ต่างๆ ของ App
│   │   └── utils/       - Utility functions (format, storage, validation)
│   │
│   ├── guards/          - Route Guards (auth.guard.ts)
│   ├── interceptors/    - HTTP Interceptors (auth.interceptor.ts)
│   ├── models/          - TypeScript Interfaces/Types
│   ├── services/        - API Services
│   └── shared/          - Shared Components (layout.component.ts)
│
└── 📄 App Root Files
    ├── app.ts           - Root Component
    ├── app.config.ts    - App Configuration
    ├── app.routes.ts    - Routing Configuration
    └── ...
```

## 📦 Modules อธิบาย

### 🎯 Feature Modules

| Module          | คำอธิบาย                                                                        | ไฟล์หลัก                                        |
| --------------- | ------------------------------------------------------------------------------- | ----------------------------------------------- |
| **account**     | จัดการบัญชีการเงินทุกประเภท (เงินสด, บัญชีธนาคาร, บัตรเครดิต, e-wallet, crypto) | `account.component.ts`                          |
| **auth**        | ระบบ Authentication - Login และ Register                                        | `login.component.ts`<br>`register.component.ts` |
| **budget**      | สร้างและติดตามงบประมาณ (รายวัน, รายสัปดาห์, รายเดือน, รายปี)                    | `budget.component.ts`                           |
| **category**    | จัดการหมวดหมู่รายรับและรายจ่าย พร้อม icon และสี                                 | `category.component.ts`                         |
| **dashboard**   | แสดงภาพรวมการเงิน สถิติ และข้อมูลสำคัญ                                          | `dashboard.component.ts`                        |
| **report**      | สร้างรายงานและวิเคราะห์ข้อมูลการเงิน                                            | `report.component.ts`                           |
| **saving-goal** | ตั้งเป้าหมายการออมและติดตามความคืบหน้า                                          | `saving-goal.component.ts`                      |
| **transaction** | บันทึกและจัดการรายการธุรกรรมรายรับ-รายจ่ายทั้งหมด                               | `transaction.component.ts`                      |

### 🛠️ Core Infrastructure

| Module           | คำอธิบาย                                        | ไฟล์หลัก               |
| ---------------- | ----------------------------------------------- | ---------------------- |
| **core**         | ฟังก์ชันและ constants หลักของ App               | `constants/`, `utils/` |
| **guards**       | ป้องกันการเข้าถึง routes ที่ต้อง Authentication | `auth.guard.ts`        |
| **interceptors** | จัดการ HTTP requests (เพิ่ม auth token)         | `auth.interceptor.ts`  |
| **models**       | TypeScript interfaces สำหรับ data models        | `*.model.ts`           |
| **services**     | API services เชื่อมต่อกับ backend               | `*.service.ts`         |
| **shared**       | Shared components เช่น Layout                   | `layout.component.ts`  |

## 🎨 Design Patterns

### Standalone Components

โปรเจกต์ใช้ **Angular Standalone Components** (ไม่มี NgModules)

### Feature-based Organization

แยก features เป็น folders ชัดเจน ทำให้:

- ✅ หา code ง่าย
- ✅ แยก concerns ชัดเจน
- ✅ Scale ได้ง่าย

### Index Files (Barrel Exports)

ทุก module มี `index.ts` สำหรับ export ทำให้ import ง่าย:

```typescript
// ❌ ก่อน
import { AccountComponent } from './account/account.component';

// ✅ หลัง
import { AccountComponent } from './account';
```

## 🔄 Data Flow

```
┌─────────────┐
│  Component  │  ← User Interface
└──────┬──────┘
       │ calls
       ▼
┌─────────────┐
│   Service   │  ← Business Logic + API Calls
└──────┬──────┘
       │ HTTP (+ Interceptor)
       ▼
┌─────────────┐
│   Backend   │  ← NestJS API
└─────────────┘
```

### Interceptor Flow

```
Component → Service → HTTP → [Auth Interceptor adds token] → Backend
```

### Guard Flow

```
User navigates → [Auth Guard checks token] → Allow/Deny route
```

## 📝 Naming Conventions

- **Components**: `feature.component.ts` (e.g., `account.component.ts`)
- **Services**: `feature.service.ts` (e.g., `account.service.ts`)
- **Models**: `feature.model.ts` (e.g., `account.model.ts`)
- **Guards**: `feature.guard.ts` (e.g., `auth.guard.ts`)
- **Interceptors**: `feature.interceptor.ts` (e.g., `auth.interceptor.ts`)

## 🚀 วิธีใช้งาน

### Import Components

```typescript
// Feature components
import { AccountComponent } from './account';
import { BudgetComponent } from './budget';
import { DashboardComponent } from './dashboard';

// Services
import { AuthService, AccountService } from './services';

// Models
import { Account, Transaction, Budget } from './models';

// Guards & Interceptors
import { AuthGuard } from './guards';
import { AuthInterceptor } from './interceptors';
```

### สร้าง Feature ใหม่

1. สร้าง folder ใหม่ใน `src/app/`
2. สร้างไฟล์ component, html, css
3. สร้าง `index.ts` สำหรับ export
4. เพิ่ม route ใน `app.routes.ts`
5. สร้าง service และ model ถ้าจำเป็น

## 🔧 Utils Available

### Format Utils (`core/utils/format.utils.ts`)

- จัดรูปแบบตัวเลข, วันที่, เงิน

### Storage Utils (`core/utils/storage.utils.ts`)

- จัดการ localStorage/sessionStorage

### Validation Utils (`core/utils/validation.utils.ts`)

- Validate forms และ data

## 📚 เอกสารเพิ่มเติม

- [API Documentation](../../../API_DOCUMENTATION.md)
- [Quick Start Guide](../../../QUICK_START.md)
- [Backend README](../../backend/README.md)
- [Services README](./services/README.md)

---

**Last Updated**: January 12, 2026
**Angular Version**: 21.0.0
**Architecture**: Standalone Components
