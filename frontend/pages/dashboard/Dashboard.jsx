import React, { useState } from 'react';
// Import các tab content
import SettingsTab from './dashboard/SettingsTab'; // Import file vừa tạo ở Bước 4

const Dashboard = () => {
  // State quản lý tab đang active (giả sử bạn đang dùng state)
  const [activeTab, setActiveTab] = useState('settings'); 

  // Hàm render nội dung dựa theo tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <div>Overview Content</div>;
      case 'applied': return <div>Applied Jobs Content</div>;
      // ... các case khác
      case 'settings': return <SettingsTab />; // <--- GỌI SETTINGS TAB TẠI ĐÂY
      default: return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white p-6 border-r">
        {/* ... Sidebar Menu items ... */}
        <button onClick={() => setActiveTab('settings')} className="...">Settings</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Render nội dung động */}
        {renderContent()}
      </div>
    </div>
  );
};
export default Dashboard;