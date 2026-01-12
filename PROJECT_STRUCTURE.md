# โครงสร้างโปรเจกต์ Budget Management

โปรเจกต์ Full-stack สำหรับจัดการงบประมาณส่วนบุคคล พัฒนาด้วย **NestJS + Angular + MongoDB**

## 📁 โครงสร้างไฟล์

```
budget-management/
│
├── 📄 เอกสาร
│   ├── README.md                    - คู่มือหลักของโปรเจกต์
│   ├── PROJECT_STRUCTURE.md         - เอกสารนี้ (โครงสร้างโปรเจกต์)
│   ├── API_DOCUMENTATION.md         - เอกสาร API endpoints
│   ├── QUICK_START.md              - คู่มือเริ่มต้นใช้งานรวดเร็ว
│   └── DOCKER_GUIDE.md             - คู่มือใช้งาน Docker
│
├── 🐳 Docker Configuration
│   ├── docker-compose.yml          - Docker compose สำหรับ development
│   └── .dockerignore               - ไฟล์ที่ไม่ต้องใส่ใน Docker image
│
└── 📦 app/                         - โค้ดแอปพลิเคชันหลัก
    │
    ├── 🔙 backend/                 - Backend API (NestJS + MongoDB)
    │   ├── Dockerfile              - Docker image สำหรับ backend
    │   ├── .dockerignore
    │   ├── package.json
    │   ├── nest-cli.json
    │   ├── tsconfig.json
    │   │
    │   └── src/
    │       ├── main.ts             - Entry point
    │       ├── app.module.ts       - Root module
    │       │
    │       ├── auth/               - 🔐 Authentication & Authorization
    │       │   ├── auth.controller.ts
    │       │   ├── auth.service.ts
    │       │   ├── auth.module.ts
    │       │   ├── guards/         - Route guards
    │       │   ├── strategies/     - Passport strategies (JWT, Local)
    │       │   └── dto/            - Data Transfer Objects
    │       │
    │       ├── user/               - 👤 User Management
    │       │   ├── user.controller.ts
    │       │   ├── user.service.ts
    │       │   ├── user.schema.ts  - Mongoose schema
    │       │   ├── user.module.ts
    │       │   └── dto/
    │       │
    │       ├── account/            - 💰 บัญชีการเงิน (บัญชีธนาคาร, เงินสด, ฯลฯ)
    │       │   ├── account.controller.ts
    │       │   ├── account.service.ts
    │       │   ├── account.schema.ts
    │       │   ├── account.module.ts
    │       │   └── dto/
    │       │
    │       ├── category/           - 📂 หมวดหมู่รายรับ-รายจ่าย
    │       │   ├── category.controller.ts
    │       │   ├── category.service.ts
    │       │   ├── category.schema.ts
    │       │   ├── category.module.ts
    │       │   └── dto/
    │       │
    │       ├── transaction/        - 💸 รายการธุรกรรม
    │       │   ├── transaction.controller.ts
    │       │   ├── transaction.service.ts
    │       │   ├── transaction.schema.ts
    │       │   ├── transaction-v2.schema.ts
    │       │   ├── transaction.module.ts
    │       │   └── dto/
    │       │
    │       ├── budget/             - 📊 งบประมาณ
    │       │   ├── budget.controller.ts
    │       │   ├── budget.service.ts
    │       │   ├── budget.schema.ts
    │       │   ├── budget.module.ts
    │       │   └── dto/
    │       │
    │       ├── saving-goal/        - 🎯 เป้าหมายการออม
    │       │   ├── saving-goal.controller.ts
    │       │   ├── saving-goal.service.ts
    │       │   ├── saving-goal.schema.ts
    │       │   ├── saving-goal.module.ts
    │       │   └── dto/
    │       │
    │       ├── report/             - 📈 รายงานและสถิติ
    │       │   ├── report.controller.ts
    │       │   ├── report.service.ts
    │       │   └── report.module.ts
    │       │
    │       ├── export/             - 📤 Export ข้อมูล
    │       │   ├── export.controller.ts
    │       │   ├── export.service.ts
    │       │   └── export.module.ts
    │       │
    │       └── scripts/            - 🔧 Utility scripts
    │           └── migrate-budget-userid.ts
    │
    └── 🎨 frontend/                - Frontend Application (Angular 21)
        ├── Dockerfile              - Docker image สำหรับ frontend
        ├── nginx.conf              - Nginx configuration
        ├── .dockerignore
        ├── package.json
        ├── angular.json
        ├── tsconfig.json
        │
        └── src/
            ├── index.html
            ├── main.ts             - Entry point
            ├── styles.css          - Global styles
            │
            └── app/
                ├── README.md       - เอกสารโครงสร้าง frontend
                │
                ├── 📄 App Root
                │   ├── app.ts              - Root component
                │   ├── app.config.ts       - App configuration
                │   ├── app.routes.ts       - Routing
                │   └── ...
                │
                ├── 🎯 Feature Modules (หน้าจอหลัก)
                │   ├── auth/               - Login, Register
                │   ├── dashboard/          - แดชบอร์ดภาพรวม
                │   ├── account/            - จัดการบัญชีการเงิน
                │   ├── category/           - จัดการหมวดหมู่
                │   ├── transaction/        - จัดการรายการธุรกรรม
                │   ├── budget/             - จัดการงบประมาณ
                │   ├── saving-goal/        - เป้าหมายการออม
                │   └── report/             - รายงานและสถิติ
                │
                ├── 🛠️ Core Infrastructure
                │   ├── core/               - Constants & Utils
                │   │   ├── constants/      - App constants
                │   │   └── utils/          - Utility functions
                │   │
                │   ├── guards/             - Route guards
                │   ├── interceptors/       - HTTP interceptors
                │   ├── models/             - TypeScript interfaces
                │   ├── services/           - API services
                │   └── shared/             - Shared components
                │
                └── environments/           - Environment configs
```

## 🏗️ Architecture Overview

### Backend (NestJS)

```
┌─────────────────────────────────────────────┐
│           NestJS Backend API                │
├─────────────────────────────────────────────┤
│  Controllers  →  Services  →  MongoDB       │
│     ↓              ↓                        │
│   DTOs        Schemas/Models                │
└─────────────────────────────────────────────┘
```

**Pattern**:

- **Controllers** - HTTP endpoints
- **Services** - Business logic
- **Schemas** - MongoDB models (Mongoose)
- **DTOs** - Data validation & transformation
- **Guards** - Authorization checks
- **Strategies** - Authentication (JWT, Local)

### Frontend (Angular)

```
┌─────────────────────────────────────────────┐
│         Angular Frontend (SSR)              │
├─────────────────────────────────────────────┤
│  Components  →  Services  →  Backend API    │
│     ↓              ↓                        │
│  Templates    HTTP Client                   │
│               + Interceptor                 │
└─────────────────────────────────────────────┘
```

**Pattern**:

- **Components** - UI & user interaction
- **Services** - API calls & business logic
- **Guards** - Route protection
- **Interceptors** - Add auth tokens
- **Models** - TypeScript interfaces

## 📊 Data Flow

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│  User    │ ───> │ Angular  │ ───> │  NestJS  │
│ Browser  │      │ Frontend │      │ Backend  │
└──────────┘      └──────────┘      └──────────┘
                         ↓                ↓
                   Interceptor       Guards
                   (Add Token)    (Check Auth)
                                        ↓
                                  ┌──────────┐
                                  │ MongoDB  │
                                  └──────────┘
```

## 🔑 Key Features by Module

| Module          | Backend | Frontend | คำอธิบาย                |
| --------------- | ------- | -------- | ----------------------- |
| **Auth**        | ✅      | ✅       | Login, Register, JWT    |
| **User**        | ✅      | ✅       | จัดการข้อมูลผู้ใช้      |
| **Account**     | ✅      | ✅       | บัญชีการเงินทุกประเภท   |
| **Category**    | ✅      | ✅       | หมวดหมู่รายรับ-รายจ่าย  |
| **Transaction** | ✅      | ✅       | รายการธุรกรรมทั้งหมด    |
| **Budget**      | ✅      | ✅       | งบประมาณและติดตาม       |
| **Saving Goal** | ✅      | ✅       | เป้าหมายการออม          |
| **Report**      | ✅      | ✅       | รายงานและวิเคราะห์      |
| **Export**      | ✅      | -        | Export ข้อมูล CSV/Excel |

## 🚀 Getting Started

### 1. ด้วย Docker (แนะนำ)

```bash
# รัน services ทั้งหมด (MongoDB + Backend + Frontend)
docker-compose up -d

# ดู logs
docker-compose logs -f
```

### 2. Development แบบปกติ

**Backend:**

```bash
cd app/backend
npm install
npm run start:dev    # Port 3000
```

**Frontend:**

```bash
cd app/frontend
npm install
npm start            # Port 4200
```

**MongoDB:**

```bash
# ติดตั้ง MongoDB หรือใช้ Docker
docker run -d -p 27017:27017 mongo:7
```

## 📝 Naming Conventions

### Backend (NestJS)

- **Controllers**: `feature.controller.ts` (e.g., `account.controller.ts`)
- **Services**: `feature.service.ts` (e.g., `account.service.ts`)
- **Modules**: `feature.module.ts` (e.g., `account.module.ts`)
- **Schemas**: `feature.schema.ts` (e.g., `account.schema.ts`)
- **DTOs**: `create-feature.dto.ts`, `update-feature.dto.ts`

### Frontend (Angular)

- **Components**: `feature.component.ts` (e.g., `account.component.ts`)
- **Services**: `feature.service.ts` (e.g., `account.service.ts`)
- **Models**: `feature.model.ts` (e.g., `account.model.ts`)
- **Guards**: `feature.guard.ts` (e.g., `auth.guard.ts`)

## 🔧 Technology Stack

### Backend

- **Framework**: NestJS 11
- **Database**: MongoDB 7 + Mongoose
- **Authentication**: JWT + Passport
- **Language**: TypeScript

### Frontend

- **Framework**: Angular 21 (Standalone Components)
- **UI**: Custom CSS
- **HTTP**: HttpClient + Interceptors
- **SSR**: Angular Universal

### DevOps

- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (for frontend)
- **Node**: v20 LTS

## 📚 เอกสารเพิ่มเติม

- **[README.md](README.md)** - คู่มือหลัก
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - API endpoints
- **[QUICK_START.md](QUICK_START.md)** - เริ่มต้นใช้งานรวดเร็ว
- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - คู่มือ Docker
- **[app/frontend/src/app/README.md](app/frontend/src/app/README.md)** - โครงสร้าง Frontend
- **[app/backend/README.md](app/backend/README.md)** - โครงสร้าง Backend

## 🔐 Security Features

- JWT-based authentication
- Password hashing (bcrypt)
- Route guards (frontend & backend)
- HTTP interceptors for token management
- CORS configuration

## 📦 Package Management

- **Package Manager**: npm
- **Lock Files**: package-lock.json
- **Node Version**: 20.x LTS

---

**Last Updated**: January 12, 2026
**Version**: 0.0.1
**License**: UNLICENSED (Private)
