// src/components/home/CategorySection.jsx
import React from 'react';
import { LayoutGrid, Code, Megaphone, PenTool, Database, Briefcase } from 'lucide-react';

const categories = [
  { name: 'Graphics & Design', icon: <PenTool className="w-8 h-8" />, color: 'bg-blue-100 text-blue-600', count: '357' },
  { name: 'Code & Programming', icon: <Code className="w-8 h-8" />, color: 'bg-green-100 text-green-600', count: '312' },
  { name: 'Digital Marketing', icon: <Megaphone className="w-8 h-8" />, color: 'bg-orange-100 text-orange-600', count: '298' },
  { name: 'Video & Animation', icon: <LayoutGrid className="w-8 h-8" />, color: 'bg-purple-100 text-purple-600', count: '156' },
  { name: 'Data & Science', icon: <Database className="w-8 h-8" />, color: 'bg-red-100 text-red-600', count: '412' },
  { name: 'Business Management', icon: <Briefcase className="w-8 h-8" />, color: 'bg-teal-100 text-teal-600', count: '125' },
];

export default function CategorySection() {
  return (
    <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Danh mục nghề nghiệp</h2>
          <button className="text-blue-600 font-medium hover:underline">Xem tất cả →</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-6 text-left border border-gray-100">
              <div className={`p-4 rounded-lg ${cat.color}`}>
                {cat.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{cat.name}</h3>
                <p className="text-gray-500 mt-1">{cat.count} công việc đang mở</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}