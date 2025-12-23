import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, Filter, ChevronDown, ChevronUp,
  Bookmark, ArrowRight, Grid, List, Clock, User, GraduationCap, Users, // <--- Đổi VenusMars thành Users
  ChevronLeft, ChevronRight, SlidersHorizontal
} from 'lucide-react';

// --- MOCK DATA ---
const candidatesData = [
  { id: 1, name: "Cody Fisher", title: "Marketing Officer", location: "New York", experience: "3 Years experience", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cody" },
  { id: 2, name: "Darrell Steward", title: "Insurance Broker", location: "New York", experience: "5 Years experience", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Darrell" },
  { id: 3, name: "Guy Hawkins", title: "Junior Graphic Designer", location: "New York", experience: "2 Years experience", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guy" },
  { id: 4, name: "Jane Cooper", title: "Senior UX Designer", location: "New York", experience: "4 Years experience", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
  { id: 5, name: "Theresa Webb", title: "Event Coordinator", location: "New York", experience: "3 Years experience", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Theresa" },
  { id: 6, name: "Kathryn Murphy", title: "Product Support Specialist", location: "New York", experience: "2 Years experience", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kathryn" },
  { id: 7, name: "Marvin McKinney", title: "Web Designer", location: "New York", experience: "4 Years experience", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marvin" },
  { id: 8, name: "Jenny Wilson", title: "Marketing Manager", location: "New York", experience: "6 Years experience", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jenny" },
];

// --- COMPONENT: Filter Section ---
const FilterSection = ({ icon: Icon, title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <button
        className="flex items-center justify-between w-full text-left mb-3 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {Icon && <Icon size={18} className="text-gray-400 group-hover:text-blue-600" />}
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {isOpen && <div className="space-y-3 pl-1">{children}</div>}
    </div>
  );
};

// --- COMPONENT: Candidate Card ---
const CandidateCard = ({ candidate, layout }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const isList = layout === 'list';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all ${isList ? 'flex flex-col md:flex-row items-start md:items-center gap-6' : ''}`}>
      {/* Avatar */}
      <div className="shrink-0 relative">
        <img src={candidate.avatar} alt={candidate.name} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm bg-gray-50" />
      </div>

      {/* Content */}
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{candidate.name}</h3>
            <p className="text-blue-600 font-medium text-sm">{candidate.title}</p>
          </div>
          <button onClick={() => setIsBookmarked(!isBookmarked)} className="text-gray-300 hover:text-blue-600 transition-colors">
            <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
            <MapPin size={14} className="text-gray-400" /> {candidate.location}
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
            <Clock size={14} className="text-gray-400" /> {candidate.experience}
          </div>
        </div>

        <div className={`mt-5 ${isList ? 'md:flex md:justify-end' : ''}`}>
          <Link to={`/candidate/${candidate.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors text-sm">
            View Profile <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
const Candidates = () => {
  const [layout, setLayout] = useState('list'); 
  const [radius, setRadius] = useState(50);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* --- 1. TITLE & BREADCRUMB --- */}
      <div className="bg-white py-5 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Find Candidates</h1>
          <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <Link to="/home" className="hover:text-blue-600">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-medium">Find Candidates</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- 2. TOP SEARCH BAR --- */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 flex items-center gap-3 border-b md:border-b-0 md:border-r border-gray-100 px-3 py-2 w-full md:w-auto">
            <Search size={20} className="text-gray-400 shrink-0" />
            <input type="text" placeholder="Job title, keyword..." className="flex-1 outline-none text-sm placeholder-gray-400 bg-transparent" />
          </div>
          <div className="flex-1 flex items-center gap-3 border-b md:border-b-0 md:border-r border-gray-100 px-3 py-2 w-full md:w-auto">
            <MapPin size={20} className="text-gray-400 shrink-0" />
            <input type="text" placeholder="Location" className="flex-1 outline-none text-sm placeholder-gray-400 bg-transparent" />
          </div>
          <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full md:w-auto">
            <Briefcase size={20} className="text-gray-400 shrink-0" />
            <select className="flex-1 outline-none text-sm text-gray-500 bg-transparent cursor-pointer appearance-none">
              <option value="">Select Category</option>
              <option value="dev">Software Developer</option>
              <option value="design">Designer</option>
            </select>
            <ChevronDown size={16} className="text-gray-400 shrink-0" />
          </div>
          <button className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shrink-0">
            Find Candidate
          </button>
        </div>


        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* --- 3. SIDEBAR FILTERS (LEFT) --- */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg mb-6 flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-blue-700 transition-colors">
              <SlidersHorizontal size={18} /> Filter
            </button>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              
              {/* Location Radius */}
              <div className="border-b border-gray-100 py-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2"><MapPin size={18} className="text-gray-400"/> Location Radius</h3>
                  <span className="text-blue-600 font-bold text-sm">{radius} miles</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={radius} onChange={(e) => setRadius(e.target.value)}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Candidate Level */}
              <FilterSection icon={User} title="Candidate Level" defaultOpen={true}>
                {["Entry Level", "Mid Level", "Expert Level"].map((level, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="level" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" defaultChecked={idx === 1} />
                    <span className="text-gray-600 text-sm group-hover:text-blue-600">{level}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Experience */}
              <FilterSection icon={Clock} title="Experience" defaultOpen={true}>
                {["Fresher", "1 - 2 Years", "2 - 4 Years", "4 - 6 Years", "6 - 10 Years", "10 - 15 Years", "15+ Years"].map((exp, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked={idx === 3} />
                    <span className="text-gray-600 text-sm group-hover:text-blue-600">{exp}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Education */}
              <FilterSection icon={GraduationCap} title="Education">
                {["All", "High School", "Associate Degree", "Bachelor's Degree", "Master's Degree", "Doctorate Degree"].map((edu, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked={idx === 3} />
                    <span className="text-gray-600 text-sm group-hover:text-blue-600">{edu}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Gender */}
              <FilterSection icon={Users} title="Gender"> {/* <-- DÙNG ICON Users Ở ĐÂY */}
                 {["Male", "Female", "Others"].map((gender, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="gender" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" defaultChecked={idx === 0} />
                    <span className="text-gray-600 text-sm group-hover:text-blue-600">{gender}</span>
                  </label>
                ))}
              </FilterSection>

            </div>
          </aside>


          {/* --- 4. MAIN CONTENT (RIGHT) --- */}
          <main className="w-full lg:w-3/4">
            {/* List Header */}
            <div className="flex flex-wrap justify-between items-center mb-6 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Sort by:</span>
                  <select className="outline-none text-sm font-medium text-gray-700 bg-transparent cursor-pointer hover:text-blue-600">
                    <option>Latest</option>
                    <option>Oldest</option>
                  </select>
                </div>
                 <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Show:</span>
                   <select className="outline-none text-sm font-medium text-gray-700 bg-transparent cursor-pointer hover:text-blue-600">
                    <option>12 per page</option>
                    <option>24 per page</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setLayout('grid')} className={`p-1.5 rounded-md transition-all ${layout === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Grid size={18} />
                </button>
                <button onClick={() => setLayout('list')} className={`p-1.5 rounded-md transition-all ${layout === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Candidate List */}
            <div className={`grid ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 gap-6' : 'grid-cols-1 gap-4'}`}>
              {candidatesData.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} layout={layout} />
              ))}
            </div>

            {/* --- 5. PAGINATION --- */}
            <div className="flex justify-center mt-10 gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors disabled:opacity-50">
                <ChevronLeft size={18} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-sm transition-colors">01</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors">02</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors">03</button>
              <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors">08</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Candidates;