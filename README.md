# Budget Management System

## 📋 รายละเอียดโปรเจค

ระบบจัดการงบประมาณส่วนบุคคล พัฒนาด้วย Angular (Frontend) และ NestJS (Backend) พร้อมฐานข้อมูล MongoDB

## 🚀 เริ่มต้นใช้งาน

### ความต้องการของระบบ

- Node.js 18+
- MongoDB
- npm หรือ yarn

### การติดตั้งและรันโปรเจค

#### Backend (NestJS)

```bash
cd app/backend
npm install
npm run start:dev
# API: http://localhost:3000
```

#### Frontend (Angular)

```bash
cd app/frontend
npm install
npm start
# App: http://localhost:4200
```

## 📁 โครงสร้างโปรเจค

### Frontend Structure

```
app/frontend/src/app/
├── models/          # Type definitions และ interfaces
├── services/        # API services
├── guards/          # Route guards (Auth)
├── interceptors/    # HTTP interceptors
├── core/            # Constants และ utilities
│   ├── constants/   # App constants
│   └── utils/       # Helper functions
├── auth/            # Authentication module
├── dashboard/       # Dashboard module
└── transaction/     # Transaction module
```

### Backend Structure

```
app/backend/src/
├── auth/            # Authentication module
├── user/            # User management
├── account/         # Bank accounts
├── budget/          # Budget planning
├── category/        # Transaction categories
├── transaction/     # Transactions
├── report/          # Reports
├── export/          # Data export
└── saving-goal/     # Saving goals
```

## 🔑 คุณสมบัติหลัก

- ✅ ระบบยืนยันตัวตน (JWT Authentication)
- ✅ จัดการบัญชีธนาคาร
- ✅ บันทึกรายรับ-รายจ่าย
- ✅ วางแผนงบประมาณ
- ✅ ติดตามเป้าหมายออม
- ✅ สร้างรายงานการเงิน
- ✅ ส่งออกข้อมูล (Excel, CSV, PDF)

## 📖 เอกสารเพิ่มเติม

- [API Documentation](./API_DOCUMENTATION.md) - เอกสาร API ทั้งหมด
- [Backend README](./app/backend/README.md) - คำแนะนำ Backend
- [Services Documentation](./app/frontend/src/app/services/README.md) - คู่มือใช้งาน Services

## 🛠️ เทคโนโลยีที่ใช้

- **Frontend**: Angular 17+, TypeScript, Standalone Components
- **Backend**: NestJS, TypeScript, JWT
- **Database**: MongoDB, Mongoose
- **Styling**: CSS, Angular Material (optional)

## 📝 การพัฒนา

โปรเจคนี้ใช้โครงสร้างแบบ Monorepo:

- `/app/frontend` - Angular application
- `/app/backend` - NestJS API

## 🎯 การใช้งานระบบ

### 1. สร้างบัญชีผู้ใช้

- ไปที่ `/register` เพื่อสร้างบัญชีใหม่
- หรือ `/login` หากมีบัญชีแล้ว

### 2. เริ่มต้นใช้งาน

1. **Dashboard** - ภาพรวมการเงินทั้งหมด
2. **บัญชี** (`/accounts`) - จัดการบัญชีธนาคาร/กระเป๋าเงิน
3. **หมวดหมู่** (`/categories`) - สร้างหมวดหมู่รายรับ-รายจ่าย
4. **รายการ** (`/transactions`) - บันทึกรายรับ-รายจ่าย
5. **งบประมาณ** (`/budgets`) - วางแผนงบประมาณ
6. **เป้าหมายออม** (`/goals`) - ตั้งเป้าการออม
7. **รายงาน** (`/reports`) - วิเคราะห์การเงิน

### 3. ฟีเจอร์พิเศษ

- 📊 วิเคราะห์รายจ่ายตามหมวดหมู่
- 💰 ติดตามยอดคงเหลือในบัญชี
- 📈 กราฟแสดงแนวโน้มรายรับ-รายจ่าย
- 🎯 ติดตามความคืบหน้าเป้าหมายออม
- 📥 ส่งออกข้อมูลเป็น CSV
- 🔄 ระบบโอนเงินระหว่างบัญชี

## 🔐 สิ่งสำคัญ

- อย่าลืมตั้งค่า environment variables ใน `.env` (Backend)
- อย่าลืมตั้งค่า API endpoint ใน `environments/` (Frontend)
- ตรวจสอบให้แน่ใจว่า MongoDB กำลังรันอยู่

## 🐛 แก้ปัญหา

### Backend ไม่เริ่มทำงาน

```bash
# ตรวจสอบ MongoDB
mongod --version
# เริ่ม MongoDB service
net start MongoDB
```

### Frontend ติด Port

```bash
# ใช้ port อื่น
ng serve --port 4201
```

### CORS Error

- ตรวจสอบ `main.ts` ใน backend ว่าเปิด CORS แล้ว
- ตรวจสอบ API URL ใน frontend environments
