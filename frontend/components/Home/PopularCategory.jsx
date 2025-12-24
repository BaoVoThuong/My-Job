// src/components/Home/PopularCategory.jsx
import React from 'react';
import { 
  Palette, Code, Megaphone, MonitorPlay, 
  Music, BarChart3, BriefcaseMedical, Database, ArrowRight 
} from 'lucide-react';

const categories = [
  { title: 'Graphics & Design', open: '357 Open position', icon: <Palette size={24}/> },
  { title: 'Code & Programing', open: '312 Open position', icon: <Code size={24}/> },
  { title: 'Digital Marketing', open: '297 Open position', icon: <Megaphone size={24}/> },
  { title: 'Video & Animation', open: '247 Open position', icon: <MonitorPlay size={24}/> },
  { title: 'Music & Audio', open: '204 Open position', icon: <Music size={24}/> },
  { title: 'Account & Finance', open: '167 Open position', icon: <BarChart3 size={24}/> },
  { title: 'Health & Care', open: '125 Open position', icon: <BriefcaseMedical size={24}/> },
  { title: 'Data & Science', open: '57 Open position', icon: <Database size={24}/>, active: true },
];

export default function PopularCategory() {
  return (
    <section className="py-20 bg-white px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold text-[#18191C]">Popular category</h2>
          <button className="text-[#0A65CC] font-semibold flex items-center gap-2 hover:underline">
            View All <ArrowRight size={20}/>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-xl flex items-center gap-4 border transition-all cursor-pointer ${
                cat.active 
                ? "bg-white shadow-xl border-blue-100 scale-105" 
                : "bg-white border-transparent hover:border-blue-200 hover:shadow-md"
              }`}
            >
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                cat.active ? "bg-[#0A65CC] text-white" : "bg-[#E7F0FA] text-[#0A65CC]"
              }`}>
                {cat.icon}
              </div>
              <div>
                <h3 className={`font-bold transition-colors ${cat.active ? "text-[#0A65CC]" : "text-[#18191C]"}`}>
                  {cat.title}
                </h3>
                <p className="text-[#767F8C] text-sm">{cat.open}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}