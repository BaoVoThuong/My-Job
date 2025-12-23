# 🗂️ Git Cleanup Guide

## 📊 Tình trạng hiện tại

Bạn vừa đổi tên folder `/src` → `/frontend`, nên git đang thấy:
- ❌ Tất cả files trong `/src` bị xóa (deleted)
- ✅ Tất cả files trong `/frontend` là mới (untracked)

## 🔧 Cách dọn dẹp git

### Option 1: Commit tất cả thay đổi (Khuyên dùng)

Đây là cách đơn giản nhất - git sẽ tự động nhận diện đây là rename:

```bash
cd "c:\Users\admin\OneDrive\Máy tính\TMDT\My-Job"

# Stage tất cả thay đổi
git add -A

# Commit
git commit -m "Reorganize project structure

- Rename /src to /frontend for clarity
- Update .gitignore with comprehensive rules
- Add API services layer (authService, jobService, userService)
- Add AuthContext and useJobs hook
- Update index.html to point to /frontend
- Clean up backend structure
"
```

### Option 2: Chỉ commit những gì cần thiết

Nếu bạn muốn kiểm soát hơn:

```bash
# 1. Stage .gitignore changes
git add .gitignore

# 2. Stage .env.example
git add .env.example

# 3. Stage backend changes
git add backend/

# 4. Remove old src/ and frontend/ folders from git
git rm -r src/
git rm -r frontend/ 2>/dev/null || true

# 5. Add new frontend folder
git add frontend/

# 6. Stage index.html changes
git add index.html

# 7. Stage package.json changes (nếu cần)
git add package.json package-lock.json

# 8. Commit
git commit -m "Reorganize: rename src to frontend and update structure"
```

## ⚠️ Quan trọng: Xử lý file .env

File `.env` đã được thêm vào `.gitignore` và **KHÔNG** bị track bởi git.

**Đảm bảo:**
1. ✅ File `.env` có trong `.gitignore`
2. ✅ File `.env.example` được commit (để team biết cấu hình)
3. ✅ **KHÔNG BAO GIỜ** commit file `.env` thật

## 📝 Kiểm tra trước khi commit

```bash
# Xem những file sẽ được commit
git status

# Xem chi tiết thay đổi
git diff --cached

# Đảm bảo .env KHÔNG có trong danh sách
git ls-files | grep "\.env$"
# -> Phải không có output
```

## 🚀 Sau khi commit

```bash
# Push lên remote (nếu cần)
git push origin master

# Hoặc nếu branch khác
git push origin <branch-name>
```

## ⚠️ Nếu đã commit .env nhầm

Nếu bạn vô tình đã commit file `.env` trước đó:

```bash
# Xóa .env khỏi git history (NGUY HIỂM - cân nhắc kỹ)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (CHỈ làm nếu bạn chắc chắn)
git push origin --force --all
```

**⚠️ LƯU Ý:** `filter-branch` sẽ thay đổi git history. Chỉ dùng nếu:
- Bạn chưa push lên remote, HOẶC
- Bạn là người duy nhất làm việc với repo này

## 📚 Files đã thay đổi

**Modified:**
- `.gitignore` - Thêm comprehensive rules
- `.env.example` - Template cho env variables
- `index.html` - Cập nhật path từ `/src` → `/frontend`
- `backend/` - Cập nhật structure và code

**Renamed:**
- `src/` → `frontend/` - Đổi tên để rõ ràng hơn

**Added:**
- `frontend/services/` - API integration layer
- `frontend/context/AuthContext.jsx` - Authentication state
- `frontend/hooks/useJobs.js` - Custom hooks
- Documentation files (SETUP_GUIDE.md, CLEANUP_INSTRUCTIONS.md)

---

## ✅ Checklist trước khi commit

- [ ] File `.env` KHÔNG có trong `git status`
- [ ] File `.env.example` có trong staged changes
- [ ] `.gitignore` đã được cập nhật
- [ ] Tất cả code mới đã được test
- [ ] Commit message rõ ràng và mô tả đầy đủ

---

**Happy Coding! 🚀**
