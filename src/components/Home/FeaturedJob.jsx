import React from 'react';
import { MapPin, DollarSign, Calendar, Bookmark, ArrowRight } from 'lucide-react';

// SVG Components cho Logo các công ty để giống mẫu 100%
const AppleLogo = () => (
  <svg viewBox="0 0 384 512" fill="currentColor" height="24" width="24">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
  </svg>
);

const FacebookLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);


const featuredJobs = [
  { 
    id: 1, 
    title: 'Senior UX Designer', 
    type: 'Contract Base', 
    location: 'Australia', 
    salary: '$30K-$35K', 
    time: '4 Days Remaining', 
    logoComponent: <span className="text-white font-bold text-xl">Up</span>, // Text cho Upwork
    logoBg: 'bg-[#47C139]' 
  },
  { 
    id: 2, 
    title: 'Software Engineer', 
    type: 'Full Time', 
    location: 'China', 
    salary: '$50K-$60K', 
    time: '4 Days Remaining', 
    logoComponent: <AppleLogo />, // Icon Apple
    logoBg: 'bg-[#18191C]', 
    logoColor: 'text-white',
    active: true 
  },
  { 
    id: 3, 
    title: 'Junior Graphic Designer', 
    type: 'Full Time', 
    location: 'Canada', 
    salary: '$50K-$70K', 
    time: '4 Days Remaining', 
    logoComponent: <span className="text-white font-bold text-xl">Fi</span>,
    logoBg: 'bg-[#000000]' 
  },
  { 
    id: 4, 
    title: 'Product Designer', 
    type: 'Full Time', 
    location: 'United States', 
    salary: '$35K-$40K', 
    time: '4 Days Remaining', 
    logoComponent: <span className="text-white font-bold text-xl">U</span>, // Udemy?
    logoBg: 'bg-[#E15B5B]' 
  },
  { 
    id: 5, 
    title: 'Marketing Officer', 
    type: 'Internship', 
    location: 'Germany', 
    salary: '$50K-$90K', 
    time: '4 Days Remaining', 
    logoComponent: <FacebookLogo />, // Facebook
    logoBg: 'bg-[#1877F2]',
    logoColor: 'text-white'
  },
  { 
    id: 6, 
    title: 'Interaction Designer', 
    type: 'Full Time', 
    location: 'France', 
    salary: '$5K-$10K', 
    time: '4 Days Remaining', 
    logoComponent: <GoogleLogo />, // Google
    logoBg: 'bg-white border border-gray-100', // Google thường nền trắng
    logoColor: 'text-[multi]' // SVG sẽ tự xử lý màu hoặc dùng class text-gray-600 nếu là icon đơn sắc
  },
];

const FeaturedJob = () => {
  return (
    <section className="py-16 px-4 max-w-[1320px] mx-auto bg-white font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[40px] font-medium text-[#18191C]">Featured job</h2>
        <button className="text-[#0A65CC] font-medium flex items-center gap-2 border border-[#EDEFF5] px-4 py-2 rounded-md hover:bg-[#F1F2F4] transition-all">
          View All <ArrowRight size={18} />
        </button>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {featuredJobs.map((job) => (
          <div 
            key={job.id} 
            className={`p-6 border rounded-xl flex flex-col md:flex-row items-center justify-between transition-all duration-200 group ${
              job.active 
                ? 'border-[#0A65CC] bg-white shadow-[0_12px_48px_rgba(0,44,109,0.1)] ring-1 ring-[#0A65CC]' 
                : 'border-[#EDEFF5] bg-white hover:border-[#0A65CC] hover:shadow-sm'
            }`}
          >
            {/* Left Side */}
            <div className="flex items-center gap-5 w-full md:w-auto">
              {/* Logo Box */}
              <div className={`w-14 h-14 ${job.logoBg} ${job.logoColor || 'text-white'} rounded-lg flex items-center justify-center shrink-0`}>
                {job.logoComponent}
              </div>
              
              <div className="flex-1">
                {/* Title & Badge */}
                <div className="flex items-center flex-wrap gap-3 mb-1.5">
                  <h3 className="text-lg font-medium text-[#18191C] leading-tight">{job.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-[11px] uppercase font-semibold tracking-wide ${
                    job.type === 'Contract Base' ? 'bg-[#FFF6E6] text-[#E7A500]' : 
                    job.type === 'Internship' ? 'bg-[#E7F0FA] text-[#0A65CC]' : 
                    'bg-[#E7F0FA] text-[#0A65CC]' // Full Time
                  }`}>
                    {job.type}
                  </span>
                </div>
                
                {/* Meta Info with Icons */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[#767F8C] text-sm">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={18} className="text-[#939AAD]" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign size={18} className="text-[#939AAD]" /> {job.salary}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={18} className="text-[#939AAD]" /> {job.time}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Buttons */}
            <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
              <button className="p-3 bg-[#F1F2F4] text-[#767F8C] rounded-lg hover:text-[#0A65CC] hover:bg-[#E7F0FA] transition-colors">
                <Bookmark size={20} />
              </button>
              <button className={`px-6 py-3 rounded-md font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                job.active 
                  ? 'bg-[#0A65CC] text-white hover:bg-[#084e9e]' 
                  : 'bg-[#E7F0FA] text-[#0A65CC] hover:bg-[#dbe9f9]'
              }`}>
                Apply Now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedJob;