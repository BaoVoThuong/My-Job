// src/components/Home/TopCompanies.jsx
import React from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const companies = [
  { name: 'Dribbble', location: 'United States', logo: 'https://img.icons8.com/color/48/dribbble.png', featured: true },
  { name: 'Upwork', location: 'United States', logo: 'https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/48/external-upwork-a-global-freelancing-platform-where-professionals-connect-and-collaborate-logo-shadow-tal-revivo.png' },
  { name: 'Slack', location: 'China', logo: 'https://img.icons8.com/color/48/slack-new.png', active: true },
  { name: 'Freepik', location: 'United States', logo: 'https://img.icons8.com/color/48/freepik.png' },
  { name: 'Dribbble', location: 'United States', logo: 'https://img.icons8.com/color/48/dribbble.png', featured: true },
  { name: 'Upwork', location: 'United States', logo: 'https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/48/external-upwork-a-global-freelancing-platform-where-professionals-connect-and-collaborate-logo-shadow-tal-revivo.png' },
  { name: 'Slack', location: 'China', logo: 'https://img.icons8.com/color/48/slack-new.png' },
  { name: 'Freepik', location: 'United States', logo: 'https://img.icons8.com/color/48/freepik.png' },
];

export default function TopCompanies() {
  return (
    <section className="py-20 bg-[#F1F2F4] px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold text-[#18191C]">Top companies</h2>
          <div className="flex gap-2">
            <button className="p-3 bg-white border border-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><ChevronLeft/></button>
            <button className="p-3 bg-white border border-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><ChevronRight/></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((comp, i) => (
            <div key={i} className={`p-6 rounded-xl border transition-all bg-white flex flex-col items-center text-center ${comp.active ? 'border-blue-300 shadow-xl' : 'border-transparent hover:border-blue-100 hover:shadow-md'}`}>
              <div className="w-14 h-14 mb-4 flex items-center justify-center">
                <img src={comp.logo} alt={comp.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-[#18191C]">{comp.name}</h3>
                {comp.featured && <span className="bg-red-50 text-red-500 text-[10px] px-2 py-0.5 rounded-full font-bold">Featured</span>}
              </div>
              <p className="text-[#767F8C] text-sm flex items-center gap-1 mb-5"><MapPin size={14}/> {comp.location}</p>
              <button className={`w-full py-3 rounded-lg font-bold transition-all ${comp.active ? 'bg-[#0A65CC] text-white shadow-lg' : 'bg-[#E7F0FA] text-[#0A65CC] hover:bg-blue-100'}`}>
                Open Position
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}