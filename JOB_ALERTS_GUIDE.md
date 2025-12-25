# Hướng Dẫn Sử Dụng Job Alerts - Dành Cho Employer

## 📌 Tổng Quan

Hệ thống Job Alerts tự động gửi thông báo cho candidates khi:
1. **Employer thay đổi trạng thái CV** (APPROVED, DECLINED, INTERVIEWING)
2. **Employer cập nhật thông tin job** (salary, location, title, job_type, v.v.)

---

## 🔹 1. CẬP NHẬT TRẠNG THÁI ĐƠN ỨNG TUYỂN (Application Status)

### API Endpoint
```http
PUT /api/employer/applications/:applicationId/status
```

### Request Headers
```
Authorization: Bearer <employer_jwt_token>
Content-Type: application/json
```

### Request Body
```json
{
  "status": "APPROVED"
}
```

### Các Trạng Thái Hợp Lệ
- `APPROVED` - Đơn ứng tuyển được chấp nhận
- `DECLINED` - Đơn ứng tuyển bị từ chối
- `INTERVIEWING` - Mời phỏng vấn
- `PENDING` - Đang chờ xử lý (mặc định)

### Response Success (200)
```json
{
  "success": true,
  "message": "Application status updated",
  "data": {
    "id": 123,
    "user_id": 45,
    "job_id": 67,
    "status": "APPROVED",
    "profile_id": 12
  }
}
```

### Ví Dụ Sử Dụng

#### JavaScript (Axios)
```javascript
const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/employer/applications/${applicationId}/status`,
      { status: status },
      {
        headers: {
          'Authorization': `Bearer ${employerToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Status updated:', response.data);
    // Candidate sẽ nhận được thông báo tự động
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

// Sử dụng
updateApplicationStatus(123, 'APPROVED');
```

#### cURL
```bash
curl -X PUT http://localhost:5000/api/employer/applications/123/status \
  -H "Authorization: Bearer YOUR_EMPLOYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"APPROVED"}'
```

### Loại Thông Báo Được Tạo

| Status | Alert Type | Notification Title | Icon Color |
|--------|-----------|-------------------|------------|
| APPROVED | APPLICATION_APPROVED | "Your application was approved" | Green ✅ |
| DECLINED | APPLICATION_DECLINED | "Application status update" | Red ❌ |
| INTERVIEWING | APPLICATION_INTERVIEWING | "Interview scheduled" | Blue 📅 |

---

## 🔹 2. CẬP NHẬT THÔNG TIN JOB

### API Endpoint
```http
PUT /api/employer/jobs/:jobId
```

### Request Headers
```
Authorization: Bearer <employer_jwt_token>
Content-Type: application/json
```

### Request Body
```json
{
  "title": "Senior Backend Developer",
  "description": "Updated job description",
  "location": "Ho Chi Minh City",
  "salary_min": 2000,
  "salary_max": 3500,
  "job_type": "Full Time",
  "experience_level": "5-7 Years",
  "skills": ["Node.js", "PostgreSQL", "AWS"],
  "active_flag": true
}
```

### Response Success (200)
```json
{
  "success": true,
  "message": "Job updated successfully",
  "job": {
    "id": 67,
    "title": "Senior Backend Developer",
    "location": "Ho Chi Minh City",
    "salary_min": 2000,
    "salary_max": 3500
  }
}
```

### Các Trường Được Theo Dõi (Important Changes)

Hệ thống sẽ tự động tạo alert khi các trường sau thay đổi:
- ✅ **title** - Tiêu đề công việc
- ✅ **location** - Địa điểm làm việc
- ✅ **salary_min / salary_max** - Mức lương
- ✅ **job_type** - Loại hình công việc (Full Time, Part Time, Remote, etc.)

### Ví Dụ Sử Dụng

#### JavaScript (Axios)
```javascript
const updateJob = async (jobId, updates) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/employer/jobs/${jobId}`,
      updates,
      {
        headers: {
          'Authorization': `Bearer ${employerToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Job updated:', response.data);
    // Tất cả candidates đã apply/save job sẽ nhận thông báo
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

// Sử dụng - Update salary
updateJob(67, {
  salary_min: 2500,
  salary_max: 4000
});

// Sử dụng - Update location và job_type
updateJob(67, {
  location: "Da Nang",
  job_type: "Remote"
});
```

#### cURL
```bash
curl -X PUT http://localhost:5000/api/employer/jobs/67 \
  -H "Authorization: Bearer YOUR_EMPLOYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "salary_min": 2500,
    "salary_max": 4000,
    "location": "Da Nang"
  }'
```

### Ai Sẽ Nhận Thông Báo?

Khi update job, hệ thống sẽ tự động gửi alert cho:
- ✅ Tất cả candidates đã **apply** job này
- ✅ Tất cả candidates đã **save/bookmark** job này

### Thông Báo Mẫu

```
Title: Job updated: Backend Developer
Message: The job "Backend Developer" at ABC Corp has been updated (salary, location changed).
Type: JOB_UPDATED
Icon: Yellow Warning ⚠️
```

---

## 📊 3. XEM DANH SÁCH APPLICATIONS (Để Lấy applicationId)

### API Endpoint
```http
GET /api/employer/applications/:jobId
```

### Response
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 123,
        "user_id": 45,
        "job_id": 67,
        "status": "PENDING",
        "applied_at": "2025-12-24T10:30:00Z",
        "candidate": {
          "full_name": "Nguyen Van A",
          "email": "nguyenvana@example.com"
        }
      }
    ]
  }
}
```

### Ví Dụ Sử Dụng
```javascript
const getApplications = async (jobId) => {
  const response = await axios.get(
    `http://localhost:5000/api/employer/applications/${jobId}`,
    {
      headers: {
        'Authorization': `Bearer ${employerToken}`
      }
    }
  );

  return response.data.data.items;
};

// Lấy danh sách applications
const applications = await getApplications(67);

// Update status cho application đầu tiên
if (applications.length > 0) {
  await updateApplicationStatus(applications[0].id, 'APPROVED');
}
```

---

## 🧪 4. TEST FLOW HOÀN CHỈNH

### Bước 1: Candidate Apply Job
```javascript
// Candidate đăng nhập và apply job
POST /api/jobs/67/apply
Headers: Authorization: Bearer <candidate_token>
Body: { "profile_id": null }
```

### Bước 2: Employer Xem Applications
```javascript
// Employer xem danh sách ứng viên
GET /api/employer/applications/67
Headers: Authorization: Bearer <employer_token>

// Response chứa applicationId = 123
```

### Bước 3: Employer Approve Application
```javascript
// Employer chấp nhận ứng viên
PUT /api/employer/applications/123/status
Headers: Authorization: Bearer <employer_token>
Body: { "status": "APPROVED" }

// ✅ Candidate nhận alert: "Your application was approved"
```

### Bước 4: Candidate Xem Alert
```javascript
// Candidate kiểm tra job alerts
GET /api/candidate/job-alerts
Headers: Authorization: Bearer <candidate_token>

// Response:
{
  "data": {
    "items": [
      {
        "id": 1,
        "type": "APPLICATION_APPROVED",
        "title": "Your application was approved",
        "message": "Your application for Backend Developer at ABC Corp was approved.",
        "jobTitle": "Backend Developer",
        "companyName": "ABC Corp",
        "readAt": null,
        "createdAt": "2025-12-24T11:00:00Z"
      }
    ]
  }
}
```

### Bước 5: Employer Update Job
```javascript
// Employer cập nhật job (tăng lương)
PUT /api/employer/jobs/67
Headers: Authorization: Bearer <employer_token>
Body: {
  "salary_min": 3000,
  "salary_max": 5000
}

// ✅ Tất cả candidates đã apply/save job nhận alert
```

---

## 🎯 5. BEST PRACTICES

### Khi Nào Nên Update Status?
- ✅ Ngay sau khi review CV
- ✅ Khi quyết định mời phỏng vấn
- ✅ Sau khi phỏng vấn xong
- ❌ Không spam update liên tục

### Khi Nào Nên Update Job?
- ✅ Khi thay đổi mức lương
- ✅ Khi thay đổi địa điểm làm việc
- ✅ Khi thay đổi loại hình công việc (Remote → Office)
- ❌ Không update những thay đổi nhỏ không quan trọng

### Error Handling
```javascript
const updateApplicationStatusSafely = async (applicationId, status) => {
  try {
    const response = await updateApplicationStatus(applicationId, status);
    console.log('✅ Success:', response.message);
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('❌ Application not found');
    } else if (error.response?.status === 400) {
      console.error('❌ Invalid status:', error.response.data.message);
    } else {
      console.error('❌ Server error');
    }
  }
};
```

---

## 📱 6. CANDIDATE EXPERIENCE

Khi employer thực hiện các actions trên, candidate sẽ:

### Nhìn Thấy Alert Trên UI
- Badge số lượng alerts chưa đọc trên menu "Job Alerts"
- Danh sách alerts với icon màu sắc phù hợp
- Filter: "Show unread only"
- Button: "Mark all as read"

### Click Vào Alert
- Tự động đánh dấu đã đọc
- Redirect đến trang job detail

### Các Loại Alert
1. 🟢 **APPLICATION_APPROVED** - Xanh lá, icon checkmark
2. 🔴 **APPLICATION_DECLINED** - Đỏ, icon X
3. 🔵 **APPLICATION_INTERVIEWING** - Xanh dương, icon calendar
4. 🟡 **JOB_UPDATED** - Vàng, icon warning

---

## 🔧 7. TROUBLESHOOTING

### Lỗi "Application not found"
```
Nguyên nhân: applicationId không tồn tại hoặc không thuộc về employer
Giải pháp: Kiểm tra lại applicationId từ API GET /applications
```

### Lỗi "Invalid status"
```
Nguyên nhân: Status không nằm trong danh sách hợp lệ
Giải pháp: Chỉ dùng: APPROVED, DECLINED, INTERVIEWING, PENDING
```

### Candidate không nhận được alert
```
Nguyên nhân:
1. Candidate chưa đăng nhập
2. API endpoint bị lỗi
Giải pháp: Check console log backend, xem có tạo alert không
```

---

## 📞 Support

Nếu có vấn đề, kiểm tra:
1. Backend logs: `console.log` trong employer.controller.js
2. Database: SELECT * FROM job_alert_notifications WHERE user_id = <candidate_id>
3. Network tab: Xem request/response từ frontend

Happy coding! 🚀
