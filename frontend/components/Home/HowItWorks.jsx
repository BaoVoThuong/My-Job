// src/components/home/HowItWorks.jsx
import React from 'react';
import { UserPlus, UploadCloud, Search, CheckCircle } from 'lucide-react';

const steps = [
  { title: 'Create account', desc: 'Aliquam facilisis egestas sapien, nec tempor leo tristique at.', icon: <UserPlus size={32}/> },
  { title: 'Upload CV/Resume', desc: 'Curabitur sit amet maximus ligula. Nam a nulla ante, Nam sodales.', icon: <UploadCloud size={32}/>, active: true },
  { title: 'Find suitable job', desc: 'Phasellus quis eleifend ex. Morbi nec fringilla nibh.', icon: <Search size={32}/> },
  { title: 'Apply job', desc: 'Curabitur sit amet maximus ligula. Nam a nulla ante, Nam sodales purus.', icon: <CheckCircle size={32}/> },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#F1F2F4] px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#18191C] mb-16">How MyJob work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, i) => (
            <div key={i} className={`relative flex flex-col items-center p-8 rounded-xl transition-all ${step.active ? 'bg-white shadow-xl scale-105 z-10' : ''}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${step.active ? 'bg-[#0A65CC] text-white' : 'bg-white text-[#0A65CC]'}`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-[#18191C] mb-3">{step.title}</h3>
              <p className="text-[#767F8C] text-sm leading-relaxed">{step.desc}</p>
              
              {/* Mũi tên cong (chỉ hiển thị trên desktop và không phải bước cuối) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 -right-12 w-24 h-8 opacity-20">
                  <svg width="100%" height="100%" viewBox="0 0 100 40" fill="none">
                    <path d="M0 20C25 5 75 35 100 20" stroke="#0A65CC" strokeWidth="2" strokeDasharray="4 4"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}