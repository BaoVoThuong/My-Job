import React from 'react';
// Đảm bảo đường dẫn import đúng tên thư mục "Home" viết hoa để tránh lỗi
import Hero from '../components/Home/Hero';
import StatsSection from '../components/Home/StatsSection';
import VacanciesSection from '../components/Home/VacanciesSection';
import PopularCategory from '../components/Home/PopularCategory';
import HowItWorks from '../components/Home/HowItWorks';
import FeaturedJob from '../components/Home/FeaturedJob'; 
import TopCompanies from '../components/Home/TopCompanies';
import Testimonial from '../components/Home/Testimonial';
import CTASection from '../components/Home/CTASection';
export default function Home() {
  return (
    <main className="min-h-screen">
      {/* PHẦN 1: HERO & STATS - Nền xám nhạt #F1F2F4 */}
      <div className="bg-[#F1F2F4]">
        <Hero />
        <StatsSection />
      </div>

      {/* PHẦN 2: MOST POPULAR VACANCIES - Nền trắng */}
      <div className="bg-white">
        <VacanciesSection />
      </div>

      {/* PHẦN 3: HOW JOBPILOT WORK - Nền xám nhạt #F1F2F4 */}
      <div className="bg-[#F1F2F4]">
        <HowItWorks />
      </div>

      {/* PHẦN 4: POPULAR CATEGORY - Nền trắng */}
      <div className="bg-white border-t border-gray-100">
        <PopularCategory />
      </div>
      {/* 5. Featured Job - Nền trắng */}
      <FeaturedJob />

      {/* 6. Top Companies - Nền xám nhạt */}
      <TopCompanies />
      <Testimonial />
      <CTASection />
      

      {/* FOOTER CHÂN TRANG */}
      <footer className="py-10 bg-white border-t border-gray-100 text-center text-gray-400 text-sm">
        
      </footer>
    </main>
  );
}