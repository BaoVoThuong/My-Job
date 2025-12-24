import React from 'react';
import { Briefcase, Facebook, Youtube, Instagram, Twitter, ArrowRight } from 'lucide-react';

export default function Footers() {
  const footerLinks = [
    {
      title: "Quick Link",
      links: [
        { name: "About", path: "#" },
        { name: "Contact", path: "#", isContact: true },
        { name: "Pricing", path: "#" },
        { name: "Blog", path: "#" },
      ]
    },
    {
      title: "Candidate",
      links: [
        { name: "Browse Jobs", path: "#" },
        { name: "Browse Employers", path: "#" },
        { name: "Candidate Dashboard", path: "#" },
        { name: "Saved Jobs", path: "#" },
      ]
    },
    {
      title: "Employers",
      links: [
        { name: "Post a Job", path: "#" },
        { name: "Browse Candidates", path: "#" },
        { name: "Employers Dashboard", path: "#" },
        { name: "Applications", path: "#" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Faqs", path: "#" },
        { name: "Privacy Policy", path: "#" },
        { name: "Terms & Conditions", path: "#" },
      ]
    }
  ];

  return (
    <footer className="bg-[#18191C] text-white pt-20">
      <div className="max-w-[1320px] mx-auto px-4">
        {/* Top Section: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-16 border-b border-[#2F3338]">
          
          {/* Brand & Contact Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-[#0A65CC] p-2 rounded-lg">
                <Briefcase size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">MyJob</span>
            </div>
            <div className="space-y-4">
              <p className="text-[#767F8C]">
                Call now: <span className="text-white font-medium">(319) 555-0115</span>
              </p>
              <p className="text-[#767F8C] max-w-[280px] leading-relaxed">
                8391 Elgin St. Celina, Delaware 10299, New York, United States of America
              </p>
            </div>
          </div>

          {/* Map Link Groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-lg font-medium mb-6 text-white">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.path} 
                      className={`flex items-center gap-2 transition-all duration-200 group ${
                        link.isContact ? 'text-white font-medium border-b border-[#0A65CC] w-fit' : 'text-[#767F8C] hover:text-white'
                      }`}
                    >
                      {link.isContact && <ArrowRight size={16} className="text-[#0A65CC]" />}
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#767F8C] text-sm italic">
            @ 2024 MyJob - Job Portal. All rights Reserved
          </p>
          
          <div className="flex items-center gap-5">
            <a href="#" className="text-[#767F8C] hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-[#767F8C] hover:text-white transition-colors">
              <Youtube size={20} />
            </a>
            <a href="#" className="text-[#767F8C] hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-[#767F8C] hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}