// src/components/home/StatsSection.jsx
import { Briefcase, Building2, Users, UserPlus } from 'lucide-react';

const stats = [
  { label: 'Live Job', value: '1,75,324', icon: <Briefcase size={24}/>, active: false },
  { label: 'Companies', value: '97,354', icon: <Building2 size={24}/>, active: true }, // Ô này có màu xanh đậm theo mẫu
  { label: 'Candidates', value: '38,47,154', icon: <Users size={24}/>, active: false },
  { label: 'New Jobs', value: '7,532', icon: <UserPlus size={24}/>, active: false },
];

export default function StatsSection() {
  return (
    <div className="bg-[#F1F2F4] pb-24 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={`p-6 rounded-xl shadow-sm flex items-center gap-4 border transition-all ${
              stat.active 
              ? "bg-[#0A65CC] text-white border-[#0A65CC]" 
              : "bg-white text-gray-900 border-gray-50 hover:border-blue-200"
            }`}
          >
            <div className={`p-4 rounded-lg ${stat.active ? "bg-white/20" : "bg-[#E7F0FA]"}`}>
              <div className={stat.active ? "text-white" : "text-[#0A65CC]"}>
                {stat.icon}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={stat.active ? "text-white/80" : "text-[#767F8C] text-sm"}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}