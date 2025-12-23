// src/components/home/Hero.jsx
import { Search, MapPin } from 'lucide-react';

// DÙNG CÁCH NÀY: Import tương đối từ thư mục assets
import heroIllustration from '../../assets/1.png'; 

export default function Hero() {
  return (
    <section className="bg-[#F1F2F4] pt-16 pb-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2">
          {/* Tiêu đề lớn chuẩn Figma */}
          <h1 className="text-[56px] font-bold text-[#18191C] leading-[1.1] mb-6">
            Find a job that suits <br/> your interest & skills.
          </h1>
          <p className="text-[#5E6670] text-lg mb-8 max-w-lg">
            A dream job can become true from now on. Let us be with you on your career path.
          </p>

          {/* Thanh tìm kiếm đôi chuẩn Figma */}
          <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-2 mb-4 w-full max-w-2xl">
            <div className="flex flex-1 items-center gap-3 px-3 border-r border-gray-100 w-full">
              <Search className="text-[#0A65CC]" size={20}/>
              <input type="text" placeholder="Job title, Keyword..." className="outline-none w-full py-3 text-gray-700"/>
            </div>
            <div className="flex flex-1 items-center gap-3 px-3 w-full">
              <MapPin className="text-[#0A65CC]" size={20}/>
              <input type="text" placeholder="Your Location" className="outline-none w-full py-3 text-gray-700"/>
            </div>
            <button className="bg-[#0A65CC] text-white px-8 py-3.5 rounded font-bold hover:bg-[#084d99]">
              Find Job
            </button>
          </div>
        </div>

        {/* Ảnh minh họa bên phải */}
        <div className="lg:w-1/2 flex justify-end">
           <img 
              src={heroIllustration}
              alt="Job Illustration" 
              className="w-full max-w-[550px] object-contain" 
           />
        </div>
      </div>
    </section>
  );
}