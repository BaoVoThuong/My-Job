import React from 'react';

export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 grid md:grid-cols-2 gap-6">
        
        {/* Card Candidate */}
        <div className="bg-[#F1F2F4] p-12 rounded-2xl flex flex-col items-start relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-[#18191C] mb-4">Become a Candidate</h3>
            <p className="text-[#5E6670] mb-8 max-w-[320px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cursus a dolor convallis efficitur.
            </p>
            <button className="bg-white text-[#0A65CC] px-6 py-3.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#0A65CC] hover:text-white transition-all">
              Register Now 
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.8333 10H4.16666M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Card Employers */}
        <div className="bg-[#0A65CC] p-12 rounded-2xl flex flex-col items-start relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4">Become a Employers</h3>
            <p className="text-white/80 mb-8 max-w-[320px]">
              Cras in massa pellentesque, mollis ligula non, luctus dui. Morbi sed efficitur dolor. Pelque augue risus, aliqu.
            </p>
            <button className="bg-white text-[#0A65CC] px-6 py-3.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-50 transition-all">
              Register Now 
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.8333 10H4.16666M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}