# Docker Setup Guide

## ไฟล์ที่สร้าง

- `docker-compose.yml` - ไฟล์หลักสำหรับรัน service ทั้งหมด
- `app/backend/Dockerfile` - Docker image สำหรับ backend (NestJS)
- `app/backend/.dockerignore` - ไฟล์ที่ไม่ต้อง copy ใน backend
- `app/frontend/Dockerfile` - Docker image สำหรับ frontend (Angular)
- `app/frontend/nginx.conf` - การตั้งค่า nginx สำหรับ frontend
- `app/frontend/.dockerignore` - ไฟล์ที่ไม่ต้อง copy ใน frontend

## การใช้งาน

### 1. รัน Application ทั้งหมด

```bash
docker-compose up -d
```

### 2. ดู Logs

```bash
# ดู logs ทั้งหมด
docker-compose logs -f

# ดู logs เฉพาะ service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 3. หยุด Application

```bash
docker-compose down
```

### 4. หยุดและลบ volumes

```bash
docker-compose down -v
```

### 5. Build ใหม่

```bash
docker-compose up -d --build
```

## การเข้าถึง

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

## การตั้งค่า Production

⚠️ **สำคัญ**: ก่อน deploy production กรุณาเปลี่ยน:

1. `MONGO_INITDB_ROOT_PASSWORD` ใน docker-compose.yml
2. `JWT_SECRET` ใน docker-compose.yml
3. Update `MONGODB_URI` ให้ตรงกับ password ใหม่

## คำสั่งเพิ่มเติม

### เข้าไปใน Container

```bash
# Backend
docker exec -it budget-backend sh

# Frontend
docker exec -it budget-frontend sh

# MongoDB
docker exec -it budget-mongodb mongosh -u admin -p password123
```

### ดูสถานะ Services

```bash
docker-compose ps
```

### Restart Service

```bash
docker-compose restart backend
docker-compose restart frontend
```

## โครงสร้าง

- **mongodb**: MongoDB database เวอร์ชัน 7
- **backend**: NestJS API server (port 3000)
- **frontend**: Angular app served by Nginx (port 80)

ทุก service เชื่อมต่อกันผ่าน `budget-network` และ backend จะรอให้ mongodb พร้อมก่อนเริ่มทำงาน
