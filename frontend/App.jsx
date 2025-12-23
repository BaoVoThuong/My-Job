import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- 1. LAYOUTS & COMPONENTS ---
import HeaderGuest from './components/HeaderGuest'; // Header chứa full menu
import Footer from './components/Footer';

// --- 2. AUTH PAGES (Đăng nhập/Đăng ký) ---
import Login from './pages/Login';
import Register from './pages/Register_Test';
import EmailVerification from './pages/EmailVerification';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';

// --- 3. MAIN PAGES (Các trang chức năng) ---
import Home from './pages/Home';
import Candidates from './pages/Candidates';          // Trang danh sách ứng viên
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateProfile from './pages/CandidateProfile'; // Trang xem hồ sơ (Dùng chung cho cả mình và người khác)
import CandidateProfileEdit from './pages/CandidateProfileEdit'; // Trang sửa hồ sơ (Modal hoặc trang riêng)
import JobAlerts from './pages/jobs/JobAlerts';
import TestAPI from './pages/TestAPI'; // Test BE-FE Connection 

// --- 4. ROUTES CONFIG (Nếu có dùng file config cũ) ---
import { jobsRoutes } from './routes/routes';

// --- 5. AUTH CONTEXT ---
import { AuthProvider } from './context/AuthContext';

// Layout Chính: Header + Nội dung + Footer
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <HeaderGuest /> 
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* =========================================================
              NHÓM 1: AUTH ROUTES (Màn hình riêng, không Menu)
             ========================================================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* TEST API */}
        <Route path="/test-api" element={<TestAPI />} />

        {/* =========================================================
            NHÓM 2: MAIN ROUTES (Có Menu Header đầy đủ)
           ========================================================= */}
        <Route element={<MainLayout />}>

          {/* Mặc định vào web -> Dashboard */}
          <Route path="/" element={<Navigate to="/candidate/dashboard" replace />} />
          
          {/* --- CÁC TRANG CHÍNH --- */}
          <Route path="/home" element={<Home />} />
          
          <Route path="/dashboard" element={<Navigate to="/candidate/dashboard" replace />} />
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />

          {/* --- DANH SÁCH ỨNG VIÊN --- */}
          <Route path="/candidates" element={<Candidates />} />

          {/* --- PROFILE (QUAN TRỌNG: ĐÂY LÀ PHẦN SỬA LỖI 404) --- */}
          
          {/* 1. Xem hồ sơ của chính mình (My Profile) */}
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          
          {/* 2. Xem hồ sơ người khác theo ID (Ví dụ: /candidate/2) */}
          <Route path="/candidate/:id" element={<CandidateProfile />} />
          
          {/* 3. Chỉnh sửa hồ sơ */}
          <Route path="/candidate/profile/edit" element={<CandidateProfileEdit />} />


          {/* --- CÁC CHỨC NĂNG KHÁC --- */}
          <Route path="/job-alerts" element={<JobAlerts />} />

          {/* --- PLACEHOLDER (Các trang chưa có file) --- */}
          <Route path="/find-job" element={<div className="p-20 text-center text-3xl font-bold text-blue-600">Trang Tìm Việc (Find Job)</div>} />
          <Route path="/find-employers" element={<div className="p-20 text-center text-3xl font-bold text-blue-600">Trang Nhà Tuyển Dụng (Employers)</div>} />
          <Route path="/mock-interview" element={<div className="p-20 text-center text-3xl font-bold text-purple-600">Phỏng Vấn Thử AI (Mock Interview)</div>} />
          <Route path="/take-certificate" element={<div className="p-20 text-center text-3xl font-bold text-orange-600">Thi Chứng Chỉ (Take Certificate)</div>} />
          <Route path="/customer-supports" element={<div className="p-20 text-center text-3xl font-bold text-green-600">Hỗ Trợ Khách Hàng (Support)</div>} />

          {/* Load thêm routes từ file config cũ (nếu có) */}
          {jobsRoutes && jobsRoutes.map((route) => (
             <Route key={route.path} path={route.path} element={route.element}>
                {route.children?.map((child, index) => (
                  <Route key={index} index={child.index} path={child.path} element={child.element} />
                ))}
             </Route>
          ))}

        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<div className="h-screen flex items-center justify-center text-4xl font-bold text-gray-400">404 - Trang không tồn tại</div>} />

      </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}