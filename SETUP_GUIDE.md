# 🚀 Setup Guide - MyJob Portal

## 📂 Cấu trúc thư mục đã được tổ chức lại

```
My-Job/
├── backend/              ← Backend (Node.js + Express + PostgreSQL)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── app.js
│   ├── .env
│   └── package.json
│
├── src/                  ← Frontend (React + Vite)
│   ├── components/
│   ├── pages/
│   ├── services/        ← ✨ API Services (MỚI)
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── jobService.js
│   │   ├── userService.js
│   │   └── paymentService.js
│   ├── context/         ← ✨ AuthContext (MỚI)
│   ├── hooks/           ← ✨ useJobs hook (MỚI)
│   └── App.jsx          ← ✨ Đã cập nhật với AuthProvider
│
├── public/              ← Static assets
├── .env                 ← ✨ Frontend env variables
├── index.html
├── vite.config.js
├── package.json         ← Frontend dependencies
└── README.md

⚠️ LƯU Ý: Thư mục /frontend/ là TRÙNG LẶP - Hãy xóa nó đi!
```

---

## 🔧 Setup Instructions

### 1️⃣ Cài đặt Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend (Root):
```bash
cd ..  # Quay về thư mục gốc My-Job
npm install
```

---

### 2️⃣ Cấu hình Environment Variables

#### ✅ Đã có file `.env` ở root với nội dung:

```env
# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MyJob
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false

# Backend Configuration (không dùng trong frontend)
PORT=5000
DATABASE_URL=postgres://...
JWT_SECRET=jobportal_9f8d7a!@#2025
MOMO_PARTNER_CODE=MOMO
...
```

---

### 3️⃣ Chạy ứng dụng

#### Terminal 1 - Backend:
```bash
cd backend
npm start
# hoặc
npm run dev  # với nodemon
```

**Backend sẽ chạy tại:** http://localhost:5000

#### Terminal 2 - Frontend:
```bash
# Ở thư mục gốc My-Job
npm run dev
```

**Frontend sẽ chạy tại:** http://localhost:5173

---

## ✅ Test kết nối BE-FE

Truy cập: **http://localhost:5173/test-api**

Bạn sẽ thấy:
- ✅ Kết nối thành công
- 📋 Danh sách jobs từ database
- 🔄 Button refresh để test lại

---

## 🎯 Các tính năng đã tích hợp

### 1. API Services Layer

**File:** `src/services/`

```javascript
// Sử dụng trong components
import jobService from './services/jobService';
import authService from './services/authService';

// Lấy jobs
const jobs = await jobService.getAllJobs();

// Login
await authService.login({ email, password });
```

### 2. Authentication Context

**File:** `src/context/AuthContext.jsx`

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome {user.fullname}!</p>
      ) : (
        <button onClick={() => login(credentials)}>Login</button>
      )}
    </div>
  );
}
```

### 3. Custom Hooks

**File:** `src/hooks/useJobs.js`

```javascript
import { useJobs } from './hooks/useJobs';

function JobList() {
  const { jobs, loading, error, refetch } = useJobs();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {jobs.map(job => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
}
```

---

## 📋 API Endpoints sẵn có

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Jobs
- `GET /api/jobs` - Lấy tất cả jobs
- `GET /api/jobs/:id` - Lấy job theo ID
- `GET /api/jobs/search` - Tìm kiếm jobs
- `POST /api/jobs/:id/apply` - Apply job (cần auth)
- `POST /api/jobs/saved/:id` - Save job (cần auth)
- `DELETE /api/jobs/saved/:id` - Unsave job (cần auth)

### Users
- `GET /api/users/profile` - Lấy profile (cần auth)
- `PUT /api/users/profile` - Cập nhật profile (cần auth)
- `GET /api/users/applied-jobs` - Lấy applied jobs (cần auth)
- `GET /api/users/saved-jobs` - Lấy saved jobs (cần auth)

### Payments
- `POST /api/payments/momo/create` - Tạo MoMo payment
- `GET /api/payments/status/:orderId` - Trạng thái payment

---

## 🗑️ Cleanup - XÓA FOLDER TRÙNG LẶP

⚠️ **QUAN TRỌNG:** Thư mục `/frontend` là TRÙNG LẶP và không được sử dụng.

### Cách xóa:

#### Windows:
1. Đóng VSCode
2. Mở Command Prompt hoặc PowerShell
3. Chạy:
```cmd
cd "c:\Users\admin\OneDrive\Máy tính\TMDT\My-Job"
rmdir /s /q frontend
```

#### Linux/Mac:
```bash
cd My-Job
rm -rf frontend
```

---

## 🎨 Cấu trúc Code hiện tại

### Frontend chính: `/src` + `/public`
- ✅ Đã có AuthProvider
- ✅ Đã có API Services
- ✅ Đã có useJobs hook
- ✅ Đã có AuthContext
- ✅ Đã có file .env

### Backend: `/backend`
- ✅ Express server
- ✅ PostgreSQL database
- ✅ JWT authentication
- ✅ MoMo payment integration
- ✅ CORS enabled

---

## 🚨 Lỗi thường gặp

### 1. Frontend không connect được Backend
**Nguyên nhân:** Backend chưa chạy hoặc CORS issue

**Giải pháp:**
```bash
# Kiểm tra backend
curl http://localhost:5000/
# Nếu không có response -> Backend chưa chạy

# Kiểm tra API
curl http://localhost:5000/api/jobs
```

### 2. VITE_API_URL undefined
**Nguyên nhân:** File `.env` không được load

**Giải pháp:**
1. Đảm bảo file `.env` ở root project (cùng cấp với `package.json`)
2. Restart Vite dev server:
```bash
# Ctrl+C để dừng
npm run dev  # Chạy lại
```

### 3. 401 Unauthorized
**Nguyên nhân:** Chưa login hoặc token hết hạn

**Giải pháp:**
```javascript
// Login lại
await authService.login({ email, password });

// Hoặc check token
const token = authService.getToken();
console.log('Token:', token);
```

---

## 📚 Tài liệu tham khảo

- [Backend API Documentation](backend/README.md)
- [Frontend Integration Guide](INTEGRATION_GUIDE.md) - Chi tiết về cách sử dụng services

---

## ✅ Checklist hoàn thành

- [x] Setup Backend với Express + PostgreSQL
- [x] Setup Frontend với React + Vite
- [x] Tạo API Services layer
- [x] Tạo AuthContext và AuthProvider
- [x] Tạo custom hooks (useJobs)
- [x] Cấu hình CORS
- [x] Tạo .env file
- [x] Test kết nối BE-FE
- [x] Tạo Test API page
- [ ] Xóa folder /frontend trùng lặp (cần làm thủ công)

---

## 🎉 Kết luận

**Frontend và Backend đã được kết nối thành công!**

Bạn có thể:
1. ✅ Gọi API từ Frontend
2. ✅ Sử dụng Authentication
3. ✅ Quản lý state với Context
4. ✅ Sử dụng custom hooks

**Next Steps:**
- Xóa folder `/frontend` trùng lặp
- Thay thế `mockJobs` bằng real API trong các components
- Implement login/register forms
- Thêm error handling và loading states

**Happy Coding! 🚀**
