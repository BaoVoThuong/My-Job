// src/components/Home/FeaturedJob.jsx
import React from 'react';
import { ArrowRight, Bookmark, MapPin, CalendarDays, DollarSign } from 'lucide-react';

const jobs = [
  { title: 'Senior UX Designer', type: 'Contract Base', company: 'Upwork', location: 'Australia', salary: '$30K-$35K', remaining: '4 Days Remaining', logo: 'https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/48/external-upwork-a-global-freelancing-platform-where-professionals-connect-and-collaborate-logo-shadow-tal-revivo.png' },
  { title: 'Software Engineer', type: 'Full Time', company: 'Apple', location: 'China', salary: '$50K-$60K', remaining: '4 Days Remaining', logo: 'https://img.icons8.com/color/48/apple-logo.png', active: true },
  { title: 'Junior Graphic Designer', type: 'Full Time', company: 'Figma', location: 'Canada', salary: '$50K-$70K', remaining: '4 Days Remaining', logo: 'https://img.icons8.com/color/48/figma--v1.png' },
  { title: 'Product Designer', type: 'Full Time', company: 'Udemy', location: 'United States', salary: '$35K-$40K', remaining: '4 Days Remaining', logo: 'https://img.icons8.com/color/48/udemy.png' },
  { title: 'Marketing Officer', type: 'Internship', company: 'Facebook', location: 'Germany', salary: '$50K-$90K', remaining: '4 Days Remaining', logo: 'https://img.icons8.com/color/48/facebook-new.png' },
  { title: 'Interaction Designer', type: 'Full Time', company: 'Google', location: 'France', salary: '$5K-$10K', remaining: '4 Days Remaining', logo: 'https://img.icons8.com/color/48/google-logo.png' },
];

export default function FeaturedJob() {
  return (
    <section className="py-20 bg-white px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-4xl font-bold text-[#18191C]">Featured job</h2>
          <button className="text-[#0A65CC] font-semibold flex items-center gap-2 hover:underline">
            View All <ArrowRight size={20}/>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job, i) => (
            <div key={i} className={`p-6 rounded-xl border flex items-center justify-between transition-all ${job.active ? 'border-blue-200 shadow-lg bg-white ring-1 ring-blue-100' : 'border-gray-100 hover:border-blue-200'}`}>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                  <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-[#18191C]">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.type === 'Full Time' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                      {job.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[#767F8C] text-sm">
                    <span className="flex items-center gap-1"><MapPin size={16}/> {job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={16}/> {job.salary}</span>
                    <span className="flex items-center gap-1"><CalendarDays size={16}/> {job.remaining}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-3 bg-gray-100 text-[#767F8C] rounded-lg hover:bg-blue-50 hover:text-blue-600">
                  <Bookmark size={20}/>
                </button>
                <button className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${job.active ? 'bg-[#0A65CC] text-white' : 'bg-[#E7F0FA] text-[#0A65CC] hover:bg-blue-100'}`}>
                  Apply Now <ArrowRight size={20}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}