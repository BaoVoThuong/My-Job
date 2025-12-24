import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  User, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download 
} from 'lucide-react';

// --- DATA GIẢ LẬP (MOCK DATA) CHO GIAO DIỆN ĐẸP ---
const applications = [
  { id: 1, name: 'Ronald Richards', role: 'UI/UX Designer', exp: '7 Years Exp', degree: 'Master Degree', date: 'Jan 23, 2022', status: 'all' },
  { id: 2, name: 'Theresa Webb', role: 'Product Designer', exp: '5 Years Exp', degree: 'High School', date: 'Jan 24, 2022', status: 'all' },
  { id: 3, name: 'Devon Lane', role: 'UX Researcher', exp: '4 Years Exp', degree: 'Bachelor', date: 'Jan 25, 2022', status: 'all' },
  { id: 4, name: 'Darrell Steward', role: 'UI Designer', exp: '7 Years Exp', degree: 'Intermediate', date: 'Jan 23, 2022', status: 'shortlisted' },
  { id: 5, name: 'Jenny Wilson', role: 'Product Lead', exp: '9 Years Exp', degree: 'PhD', date: 'Jan 20, 2022', status: 'shortlisted' },
];

export default function JobDashboard() {
  // State để chuyển Tab (Thay thế cho Sidebar)
  const [activeTab, setActiveTab] = useState('my-jobs');

  // Menu Tabs ngang
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'my-jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'saved', label: 'Saved Candidate', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- HEADER CỦA DASHBOARD --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Manage your job postings and applications</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
            <Plus size={20} /> Post a Job
          </button>
        </div>

        {/* --- NAVIGATION TABS (THAY THẾ SIDEBAR) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 px-2">
          <div className="flex overflow-x-auto no-scrollbar gap-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- NỘI DUNG CHÍNH (THAY ĐỔI THEO TAB) --- */}
        {activeTab === 'my-jobs' && (
          <div className="animate-in fade-in duration-300">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search application..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Filter size={18} /> Filter
                </button>
                <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                  Sort Action
                </button>
              </div>
            </div>

            {/* KANBAN BOARD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto pb-4">
              
              {/* COLUMN 1: All Application */}
              <div className="min-w-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800">All Application</h3>
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">213</span>
                  </div>
                  <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
                </div>
                
                <div className="flex flex-col gap-4">
                  {applications.filter(app => app.status === 'all').map((app) => (
                    <CandidateCard key={app.id} data={app} />
                  ))}
                </div>
              </div>

              {/* COLUMN 2: Shortlisted */}
              <div className="min-w-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800">Shortlisted</h3>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">2</span>
                  </div>
                  <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
                </div>

                <div className="flex flex-col gap-4">
                  {applications.filter(app => app.status === 'shortlisted').map((app) => (
                    <CandidateCard key={app.id} data={app} />
                  ))}
                </div>
              </div>

              {/* COLUMN 3: Placeholder (Create New) */}
              <div className="min-w-[300px]">
                 <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                    <Plus size={20} /> Create New Column
                 </button>
              </div>

            </div>
          </div>
        )}

        {/* Nội dung Placeholder cho các tab khác */}
        {activeTab === 'overview' && <PlaceholderContent title="Overview" />}
        {activeTab === 'saved' && <PlaceholderContent title="Saved Candidates" />}
        {activeTab === 'settings' && <PlaceholderContent title="Settings" />}

      </div>
    </div>
  );
}

// --- COMPONENT CON (CARD ỨNG VIÊN) ---
const CandidateCard = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {data.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer">{data.name}</h4>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{data.role}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
           <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
           <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> {data.exp}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
           <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> {data.degree}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
           <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Applied: {data.date}
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
        <Download size={16} /> Download CV
      </button>
    </div>
  );
};

// --- COMPONENT PLACEHOLDER ---
const PlaceholderContent = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 border-dashed">
     <h2 className="text-xl font-semibold text-gray-400">Content for {title}</h2>
  </div>
);