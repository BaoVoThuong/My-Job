import React, { useState } from 'react';
import CandidateProfileEditModal from '../components/CandidateProfileEditModal'; 
import { Settings } from 'lucide-react';

const CandidateDashboard = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      {/* Header Dashboard */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
        
        {/* Nút bấm mở Modal */}
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-blue-200 shadow-lg transition-all"
        >
          <Settings size={20} /> Edit Profile
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white p-10 rounded-2xl shadow-sm">
        <p className="text-gray-500">Nội dung Dashboard của ứng viên nằm ở đây...</p>
      </div>

      {/* Nhúng Modal vào đây */}
      <CandidateProfileEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
};

export default CandidateDashboard;