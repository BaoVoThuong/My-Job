// src/components/home/VacanciesSection.jsx
import React from 'react';

const vacancies = [
  { title: 'Anesthesiologists', open: '45,904 Open Positions' },
  { title: 'Surgeons', open: '50,364 Open Positions' },
  { title: 'Obstetricians-Gynecologists', open: '4,339 Open Positions' },
  { title: 'Orthodontists', open: '20,079 Open Positions' },
  { title: 'Maxillofacial Surgeons', open: '74,875 Open Positions' },
  { title: 'Software Developer', open: '43,359 Open Positions' },
  { title: 'Psychiatrists', open: '18,599 Open Positions' },
  { title: 'Data Scientist', open: '28,200 Open Positions', active: true },
  { title: 'Financial Manager', open: '61,391 Open Positions' },
  { title: 'Management Analysis', open: '93,046 Open Positions' },
  { title: 'IT Manager', open: '50,963 Open Positions' },
  { title: 'Operations Research Analysis', open: '16,627 Open Positions' },
];

export default function VacanciesSection() {
  return (
    <section className="py-20 bg-white px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-[#18191C] mb-12">Most Popular Vacancies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {vacancies.map((v, i) => (
            <div key={i} className="group cursor-pointer">
              <h3 className={`font-semibold text-lg mb-1 transition-colors ${v.active ? 'text-[#0A65CC] underline' : 'text-[#18191C] group-hover:text-[#0A65CC]'}`}>
                {v.title}
              </h3>
              <p className="text-[#767F8C] text-sm">{v.open}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}