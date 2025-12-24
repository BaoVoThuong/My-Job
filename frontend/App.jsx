import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';

// --- 1. LAYOUTS & COMPONENTS ---
import HeaderGuest from './components/HeaderGuest'; 
import Footer from './components/Footer';

// --- 2. AUTH PAGES ---
import Login from './pages/Login';
import Register from './pages/Register_Test';
import EmailVerification from './pages/EmailVerification';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';

// --- 3. PAGES ---
import Home from './pages/Home';
import Candidates from './pages/Candidates';           
import CandidateDashboard from './pages/CandidateDashboard'; 
import CandidateProfile from './pages/CandidateProfile'; 
import CandidateProfileEdit from './pages/CandidateProfileEdit'; 
import JobAlerts from './pages/jobs/JobAlerts';
import TestAPI from './pages/TestAPI'; 

// --- 4. DASHBOARD MỚI ---
import JobDashboard from './pages/dashboard/Dashboard'; 

// --- 5. CONFIG ---
import { AuthProvider } from './context/AuthContext';
import { jobsRoutes } from './routes/routes';

// --- COMPONENT "ĐANG CẬP NHẬT" ---
const FeatureUpdating = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-10 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        <div className="mx-auto bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang Cập Nhật</h2>
        <p className="text-gray-500 mb-6">
          Tính năng <span className="font-semibold text-blue-600">{title}</span> đang được phát triển.
        </p>
        <Link 
          to="/dashboard" 
          className="block w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

// --- LAYOUT ---
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <HeaderGuest /> 
      <main className="flex-1">
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
          {/* --- AUTH --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/test-api" element={<TestAPI />} />

          {/* ❌ XÓA HOẶC COMMENT DÒNG DASHBOARD Ở ĐÂY ❌ */}
          {/* <Route path="/dashboard" element={<JobDashboard />} /> */}

          {/* --- MAIN LAYOUT (Header + Footer) --- */}
          <Route element={<MainLayout />}>
            
            {/* 👇 CHUYỂN DASHBOARD VÀO ĐÂY ĐỂ DÙNG CHUNG HEADER/FOOTER */}
            <Route path="/dashboard" element={<JobDashboard />} />
            <Route path="/employer/dashboard" element={<JobDashboard />} />

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/candidate/dashboard" element={<Navigate to="/dashboard" replace />} /> />
            
            {/* Các trang chức năng */}
            <Route path="/home" element={<Home />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidate/profile" element={<CandidateProfile />} />
            <Route path="/candidate/:id" element={<CandidateProfile />} />
            <Route path="/candidate/profile/edit" element={<CandidateProfileEdit />} />
            <Route path="/jobs/alert-jobs" element={<JobAlerts />} />
            <Route path="/job-alerts" element={<JobAlerts />} />

            {/* --- XỬ LÝ CÁC LINK BỊ LỖI 404 TRONG ẢNH --- */}
            
            {/* 1. Interview & Mock Interview */}
            <Route path="/interview" element={<FeatureUpdating title="Phỏng vấn (Interview)" />} />
            {/* Link trong ảnh mock-interview -> chuyển về interview */}
            <Route path="/mock-interview" element={<Navigate to="/interview" replace />} />

            {/* 2. Certificate & Take Certificate */}
            <Route path="/certificate" element={<FeatureUpdating title="Chứng chỉ (Certificate)" />} />
            {/* Link trong ảnh take-certificate -> chuyển về certificate */}
            <Route path="/take-certificate" element={<Navigate to="/certificate" replace />} />
            
            {/* 3. Support & Customer Supports */}
            <Route path="/support" element={<FeatureUpdating title="Hỗ trợ (Support)" />} />
            {/* Link trong ảnh customer-supports -> chuyển về support */}
            <Route path="/customer-supports" element={<Navigate to="/support" replace />} />
            
            {/* 4. Find Job & Employers */}
            <Route path="/find-job" element={<FeatureUpdating title="Tìm việc" />} />
            <Route path="/find-employers" element={<FeatureUpdating title="Nhà tuyển dụng" />} />

            {/* Load routes cũ nếu có */}
            {jobsRoutes && jobsRoutes.map((route) => (
               <Route key={route.path} path={route.path} element={route.element}>
                  {route.children?.map((child, index) => (
                    <Route key={index} index={child.index} path={child.path} element={child.element} />
                  ))}
               </Route>
            ))}
          </Route>

          {/* --- 404 PAGE --- */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen bg-white">
               <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
               <p className="text-xl text-gray-600 mt-4 font-medium">Không tìm thấy trang này</p>
               <Link to="/dashboard" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                 Quay về Dashboard
               </Link>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}