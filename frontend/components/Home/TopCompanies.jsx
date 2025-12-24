import React from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

// SVG Components cho Logo các công ty
const DribbbleLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" height="32" width="32">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.93 14.83c-2.42-.4-4.52-1.57-6.04-3.17 1.48-2.3 3.8-3.95 6.54-4.41.36.93.64 1.9.84 2.9-.46 1.57-.93 3.14-1.34 4.68zM6.1 9.07c1.6-1.78 3.86-2.95 6.4-3.08.13.73.22 1.48.27 2.23-2.9.46-5.36 2.05-6.95 4.31-.22-.96-.28-1.96-.18-2.94.13-.17.28-.34.46-.52zm7.66 9.87c.36-1.63.79-3.3 1.25-4.94 2.28.31 4.32 1.37 5.76 2.92-1.63 1.34-3.71 2.14-5.96 2.02h-1.05zm2.84-6.48c-.22-1.05-.51-2.07-.88-3.04 2.37.16 4.54 1.14 6.22 2.7-.93 1.99-2.54 3.6-4.56 4.52-.25-.73-.52-1.46-.78-2.18z"/>
  </svg>
);

const UpworkLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" height="24" width="24">
     {/* Logo Upwork đơn giản hóa hoặc dùng SVG chuẩn */}
     <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.594 0-4.707 2.114-4.707 4.709 0 .472.07.928.196 1.364l-.234 1.096c-1.385-1.174-2.222-2.768-2.222-4.55V1.282H9.231v6.355c0 1.554.498 3.011 1.346 4.223L8.85 22.718h2.646l1.386-8.834c1.604 1.362 3.674 2.016 5.679 2.016 4.062 0 7.364-3.303 7.364-7.364S22.623 1.154 18.561 5.018zM3.462 12.428h2.363V1.282H3.462v11.146z"/>
  </svg>
);

const SlackLogo = () => (
    <svg viewBox="0 0 24 24" height="24" width="24">
        {/* Slack logo multi-color */}
        <path fill="#36C5F0" d="M6 15a2 2 0 1 1-2-2 2 2 0 0 1 2 2z"/>
        <path fill="#36C5F0" d="M7 15h2.5a2.5 2.5 0 0 1 0 5H7v-5z"/>
        <path fill="#2EB67D" d="M9 7a2 2 0 1 1-2-2 2 2 0 0 1 2 2z"/>
        <path fill="#2EB67D" d="M9 8V5.5a2.5 2.5 0 0 1 5 0V8H9z"/>
        <path fill="#E01E5A" d="M18 9a2 2 0 1 1 2 2 2 2 0 0 1-2-2z"/>
        <path fill="#E01E5A" d="M17 9h-2.5a2.5 2.5 0 0 1 0-5H17v5z"/>
        <path fill="#ECB22E" d="M15 17a2 2 0 1 1 2 2 2 2 0 0 1-2-2z"/>
        <path fill="#ECB22E" d="M15 16v2.5a2.5 2.5 0 0 1-5 0V16h5z"/>
    </svg>
);

const FreepikLogo = () => (
    <svg viewBox="0 0 24 24" fill="white" height="24" width="24">
        <path d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8zm7 4v-2h2v2h-2zm-1-6h4v3h-4v-3z"/>
    </svg>
);

const TopCompanies = () => {
  // Dữ liệu cho 8 ô công ty (2 hàng x 4 cột)
  const companies = [
    { 
      id: 1, 
      name: 'Dribbble', 
      location: 'United States', 
      featured: true, 
      logoComponent: <DribbbleLogo />, 
      logoBg: 'bg-[#EA4C89]', // Màu hồng của Dribbble
      active: false
    },
    { 
      id: 2, 
      name: 'Upwork', 
      location: 'United States', 
      logoComponent: <UpworkLogo />, 
      logoBg: 'bg-[#37A000]', // Màu xanh lá của Upwork
      active: false
    },
    { 
      id: 3, 
      name: 'Slack', 
      location: 'China', 
      logoComponent: <SlackLogo />, 
      logoBg: 'bg-white', // Slack logo có màu sẵn, nền trắng
      active: true, // Trạng thái active (viền xanh đậm)
      logoBorder: 'border border-gray-100' // Thêm viền nhẹ cho logo nền trắng
    },
    { 
      id: 4, 
      name: 'Freepik', 
      location: 'United States', 
      logoComponent: <FreepikLogo />, 
      logoBg: 'bg-[#1273EB]', // Màu xanh dương của Freepik
      active: false
    },
    { 
      id: 5, 
      name: 'Dribbble', 
      location: 'United States', 
      featured: true, 
      logoComponent: <DribbbleLogo />, 
      logoBg: 'bg-[#EA4C89]', 
      active: false
    },
    { 
      id: 6, 
      name: 'Upwork', 
      location: 'United States', 
      logoComponent: <UpworkLogo />, 
      logoBg: 'bg-[#37A000]', 
      active: false
    },
    { 
      id: 7, 
      name: 'Slack', 
      location: 'China', 
      logoComponent: <SlackLogo />, 
      logoBg: 'bg-white', 
      active: false,
      logoBorder: 'border border-gray-100'
    },
    { 
      id: 8, 
      name: 'Freepik', 
      location: 'United States', 
      logoComponent: <FreepikLogo />, 
      logoBg: 'bg-[#1273EB]', 
      active: false
    },
  ];

  return (
    <section className="py-16 bg-[#F1F2F4] font-sans">
      <div className="max-w-[1320px] mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-[32px] font-medium text-[#18191C]">Top companies</h2>
          <div className="flex gap-3">
            <button className="p-3 bg-white border border-[#E4E5E8] rounded-md text-[#0A65CC] hover:bg-[#0A65CC] hover:text-white transition-all shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <button className="p-3 bg-white border border-[#E4E5E8] rounded-md text-[#0A65CC] hover:bg-[#0A65CC] hover:text-white transition-all shadow-sm">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Grid 4 cột x 2 hàng = 8 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((co) => (
            <div 
              key={co.id} 
              className={`bg-white p-8 rounded-xl text-center border transition-all duration-200 group ${
                co.active 
                  ? 'border-[#0A65CC] shadow-[0_12px_32px_rgba(0,44,109,0.1)] ring-1 ring-[#0A65CC]' 
                  : 'border-transparent hover:border-[#0A65CC] hover:shadow-lg'
              }`}
            >
              {/* Logo Box */}
              <div className={`w-16 h-16 ${co.logoBg} ${co.logoBorder || ''} mx-auto mb-5 rounded-xl flex items-center justify-center`}>
                {co.logoComponent}
              </div>

              {/* Company Name & Featured Badge */}
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <h4 className="font-semibold text-lg text-[#18191C]">{co.name}</h4>
                {co.featured && (
                  <span className="bg-[#FFEEEE] text-[#FF4F4F] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    Featured
                  </span>
                )}
              </div>

              {/* Location */}
              <p className="flex items-center justify-center gap-1.5 text-[#939AAD] text-sm mb-6">
                <MapPin size={16} className="text-[#939AAD]" /> {co.location}
              </p>

              {/* Button */}
              <button className={`w-full py-3 rounded-md font-semibold transition-all ${
                co.active 
                  ? 'bg-[#0A65CC] text-white hover:bg-[#084e9e]' 
                  : 'bg-[#E7F0FA] text-[#0A65CC] group-hover:bg-[#0A65CC] group-hover:text-white'
              }`}>
                Open Position
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompanies;