# 🗑️ Hướng dẫn dọn dẹp thư mục trùng lặp

## ⚠️ Vấn đề

Hiện tại project có **2 bộ frontend code**:
1. ✅ **`/src` + `/public`** - Frontend CHÍNH (đang sử dụng)
2. ❌ **`/frontend`** - Frontend TRÙNG LẶP (cần xóa)

Frontend đang chạy là bộ code ở **ROOT** (`/src`, `/public`), không phải `/frontend`.

---

## 🎯 Cần làm gì?

**XÓA thư mục `/frontend` để tránh nhầm lẫn!**

Thư mục này không được sử dụng và đang gây confusion.

---

## 📋 Các bước thực hiện

### Bước 1: Đóng VSCode
Thư mục `/frontend` có thể đang bị lock bởi VSCode hoặc dev server.

1. Nhấn `Ctrl + C` trong terminal đang chạy `npm run dev` (nếu có)
2. Đóng hoàn toàn VSCode

### Bước 2: Xóa thư mục

#### Trên Windows:

**Cách 1: PowerShell (Khuyên dùng)**
```powershell
cd "c:\Users\admin\OneDrive\Máy tính\TMDT\My-Job"
Remove-Item -Recurse -Force .\frontend
```

**Cách 2: Command Prompt**
```cmd
cd "c:\Users\admin\OneDrive\Máy tính\TMDT\My-Job"
rmdir /s /q frontend
```

**Cách 3: File Explorer**
1. Mở thư mục `My-Job` trong File Explorer
2. Tìm folder `frontend`
3. Nhấn `Shift + Delete` để xóa vĩnh viễn (bỏ qua Recycle Bin)

#### Trên Linux/Mac:

```bash
cd "c:\Users\admin\OneDrive\Máy tính\TMDT\My-Job"
rm -rf frontend
```

### Bước 3: Xác nhận đã xóa

```bash
cd "c:\Users\admin\OneDrive\Máy tính\TMDT\My-Job"
ls -la
```

Bạn sẽ thấy:
```
drwxr-xr-x 1 admin 197609      0 .git
drwxr-xr-x 1 admin 197609      0 backend     ✅
drwxr-xr-x 1 admin 197609      0 node_modules
drwxr-xr-x 1 admin 197609      0 public      ✅
drwxr-xr-x 1 admin 197609      0 src         ✅
-rw-r--r-- 1 admin 197609    473 .env
-rw-r--r-- 1 admin 197609   1279 package.json
...
```

**KHÔNG CÒN thư mục `frontend` nữa!** ✅

### Bước 4: Mở lại VSCode và chạy

```bash
# Mở VSCode
code .

# Chạy frontend
npm run dev

# Trong terminal khác, chạy backend
cd backend
npm start
```

---

## ✅ Sau khi xóa

Cấu trúc thư mục sẽ gọn gàng như sau:

```
My-Job/
├── backend/          ← Backend code
│   ├── src/
│   ├── .env
│   └── package.json
│
├── src/              ← Frontend code (DUY NHẤT)
│   ├── components/
│   ├── pages/
│   ├── services/    ← API services
│   ├── context/     ← AuthContext
│   ├── hooks/       ← useJobs
│   └── App.jsx
│
├── public/          ← Static assets
├── .env             ← Frontend env variables
├── index.html
├── vite.config.js
└── package.json     ← Frontend dependencies
```

---

## 🚨 Nếu không xóa được

### Lỗi: "Directory not empty" hoặc "Device or resource busy"

**Nguyên nhân:**
- VSCode đang lock folder
- Dev server đang chạy
- File explorer đang mở trong folder đó

**Giải pháp:**
1. **Tắt tất cả** VSCode windows
2. **Dừng** tất cả terminals đang chạy
3. **Đóng** File Explorer
4. **Restart** máy tính (nếu cần thiết)
5. Thử lại lệnh xóa

### Lỗi: "Access denied" hoặc "Permission denied"

**Giải pháp:**
1. Chạy PowerShell/Command Prompt **As Administrator**
2. Chạy lại lệnh xóa

---

## 🎉 Hoàn thành!

Sau khi xóa thành công:
- ✅ Không còn confusion giữa 2 bộ code
- ✅ Project gọn gàng hơn
- ✅ Dễ maintain hơn

**Test lại ứng dụng:**
1. Mở http://localhost:5173/test-api
2. Kiểm tra kết nối BE-FE
3. Đảm bảo mọi thứ hoạt động bình thường

---

**Happy Coding! 🚀**
