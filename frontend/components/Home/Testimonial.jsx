import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: "Robert Fox",
    role: "UI/UX Designer",
    content: "Ut ullamcorper hendrerit tempor. Aliquam in rutrum dui. Maecenas ac placerat metus, in faucibus est.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert"
  },
  {
    id: 2,
    name: "Bessie Cooper",
    role: "Creative Director",
    content: "Mauris eget lorem odio. Mauris convallis justo molestie metus aliquam lacinia. Suspendisse ut dui vulputate augue condimentum ornare.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bessie"
  },
  {
    id: 3,
    name: "Jane Cooper",
    role: "Photographer",
    content: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse et magna quis nibh.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
  }
];

export default function Testimonial() {
  return (
    <section className="py-20 bg-[#F1F2F4]">
      <div className="max-w-[1320px] mx-auto px-4">
        <h2 className="text-4xl font-semibold text-[#18191C] text-center mb-12 text-center">Clients Testimonial</h2>
        
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={3}
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-white p-8 rounded-xl shadow-sm h-full flex flex-col justify-between border border-transparent hover:border-[#0A65CC] transition-all duration-300">
                <div>
                  <div className="flex text-[#FFAA00] mb-4 text-xl">★★★★★</div>
                  <p className="text-[#5E6670] leading-relaxed mb-8">“{item.content}”</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <h4 className="font-bold text-[#18191C]">{item.name}</h4>
                      <p className="text-sm text-[#767F8C]">{item.role}</p>
                    </div>
                  </div>
                  <span className="text-4xl text-[#E4E5E8] font-serif">“</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}