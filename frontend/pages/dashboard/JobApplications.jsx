// File: frontend/pages/dashboard/JobApplications.jsx
import React from 'react';
import { 
  MoreHorizontal, Download, Filter, PlusCircle, 
  Search, ChevronDown 
} from 'lucide-react';

// --- Sub-component: Thẻ Ứng Viên ---
const CandidateCard = ({ name, role, exp, edu, date }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3 hover:shadow-md transition-all cursor-pointer">
    <div className="flex justify-between items-start mb-3">
      <div className="flex gap-3">
        {/* Avatar giả */}
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-sm">{name}</h4>
          <p className="text-gray-400 text-[11px] font-medium uppercase">{role}</p>
        </div>
      </div>
      <button className="text-gray-300 hover:text-gray-600">
        <MoreHorizontal size={18} />
      </button>
    </div>

    <div className="space-y-1 mb-3 pl-1">
      <div className="flex items-center gap-2 text-gray-500 text-xs">
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
        <span>{exp} Years Exp</span>
      </div>
      <div className="flex items-center gap-2 text-gray-500 text-xs">
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
        <span>{edu}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-500 text-xs">
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
        <span>Applied: {date}</span>
      </div>
    </div>

    <button className="flex items-center gap-2 text-blue-600 font-semibold text-xs hover:bg-blue-50 px-2 py-1 rounded -ml-2 transition-colors">
      <Download size={14} />
      Download Cv
    </button>
  </div>
);

// --- Component Chính ---
const JobApplications = () => {
  return (
    <div className="h-full flex flex-col">
      {/* 1. Breadcrumb & Header của trang con */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-2 font-medium">
          Home / Job / Senior UI/UX Designer / <span className="text-blue-600">Applications</span>
        </p>
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold text-gray-800">Job Applications</h2>
          
          {/* Filter Tools */}
          <div className="flex gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"/>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50">
                <Filter size={16} /> Filter
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700">
                Sort Action
            </button>
          </div>
        </div>
      </div>

      {/* 2. Kanban Board Area */}
      {/* overflow-x-auto để cuộn ngang nếu nhiều cột */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
            
            {/* CỘT 1: All Application */}
            <div className="w-[320px] flex flex-col">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        All Application 
                        <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">213</span>
                    </h3>
                    <MoreHorizontal size={18} className="text-gray-400 cursor-pointer" />
                </div>
                {/* Vùng chứa thẻ (Scroll dọc) */}
                <div className="flex-1 bg-gray-100/50 rounded-xl p-3 border border-gray-200 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
                    <CandidateCard name="Ronald Richards" role="UI/UX Designer" exp="7" edu="Master Degree" date="Jan 23, 2022" />
                    <CandidateCard name="Theresa Webb" role="Product Designer" exp="5" edu="High School" date="Jan 24, 2022" />
                    <CandidateCard name="Devon Lane" role="UX Researcher" exp="4" edu="Bachelor" date="Jan 25, 2022" />
                    <CandidateCard name="Cody Fisher" role="Frontend Dev" exp="2" edu="Bachelor" date="Jan 26, 2022" />
                </div>
            </div>

            {/* CỘT 2: Shortlisted */}
            <div className="w-[320px] flex flex-col">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        Shortlisted
                        <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full">2</span>
                    </h3>
                    <MoreHorizontal size={18} className="text-gray-400 cursor-pointer" />
                </div>
                <div className="flex-1 bg-gray-100/50 rounded-xl p-3 border border-gray-200 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
                    <CandidateCard name="Darrell Steward" role="UI Designer" exp="7" edu="Intermediate" date="Jan 23, 2022" />
                    <CandidateCard name="Jenny Wilson" role="Product Lead" exp="9" edu="PhD" date="Jan 20, 2022" />
                </div>
            </div>

             {/* CỘT 3: Add New */}
             <div className="w-[320px] pt-[44px]">
                <button className="w-full h-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 font-medium hover:bg-white hover:border-blue-400 hover:text-blue-500 transition-all">
                    <PlusCircle size={18} /> Create New Column
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default JobApplications;