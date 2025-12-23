import React, { useState } from 'react';
import { UserCog, ShieldCheck, Bell } from 'lucide-react';
import CandidateProfileEditModal from '../../components/CandidateProfileEditModal';

const SettingsTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Cài đặt tài khoản</h2>
      
      {/* Card Thông tin cá nhân */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <UserCog size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Thông tin hồ sơ</h3>
            <p className="text-sm text-gray-500">Cập nhật ảnh đại diện, tiểu sử và thông tin liên hệ</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
        >
          Chỉnh sửa Profile
        </button>
      </div>

      {/* Các mục Settings khác (Placeholder cho đẹp UI) */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6 shadow-sm flex items-center justify-between opacity-60">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-full"><ShieldCheck size={24} /></div>
          <div><h3 className="font-semibold">Bảo mật & Mật khẩu</h3><p className="text-sm text-gray-500">Đổi mật khẩu và xác thực 2 bước</p></div>
        </div>
        <button className="px-5 py-2 border rounded-lg text-gray-600">Thay đổi</button>
      </div>

      {/* Nhúng Modal vào đây */}
      <CandidateProfileEditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default SettingsTab;