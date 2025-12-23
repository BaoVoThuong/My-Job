import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Globe, Linkedin, Github, Edit, Calendar } from 'lucide-react';

// 1. Import Modal Component
import CandidateProfileEditModal from '../components/CandidateProfileEditModal'; 

const CandidateProfile = () => {
  // 2. State to toggle Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock Profile Data (Display Only)
  const profileData = {
    avatar: "https://github.com/shadcn.png",
    fullName: "Nguyen Van A",
    email: "nguyencsehcmut@gmail.com",
    phone: "(+84) 909 123 456",
    address: "Ho Chi Minh City, Vietnam",
    jobTitle: "Senior Frontend Developer",
    website: "https://my-portfolio.com",
    linkedin: "linkedin.com/in/nguyenvana",
    github: "github.com/nguyenvana",
    bio: "I am a passionate developer with over 5 years of experience working with ReactJS and NodeJS. I love building beautiful user interfaces and optimizing user experience for large-scale applications.",
    experience: "5 Years",
    skills: "ReactJS, TailwindCSS, Node.js, MongoDB, TypeScript"
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      
      {/* Page Title */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your personal information and how employers see your profile.</p>
        </div>
        
        {/* 3. Open Modal Button */}
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-all"
        >
          <Edit size={16} /> Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative"></div>

        <div className="p-8 -mt-12">
          
          {/* --- HEADER PROFILE --- */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-10">
            {/* Avatar */}
            <div className="relative">
              <img 
                src={profileData.avatar} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-white" 
              />
            </div>
            
            <div className="flex-1 mb-2">
              <h2 className="text-3xl font-bold text-gray-900">{profileData.fullName}</h2>
              <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                <Briefcase size={16} className="text-blue-600" /> 
                {profileData.jobTitle}
              </p>
            </div>
          </div>

          {/* --- DETAIL CONTENT --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Personal Info */}
            <div className="md:col-span-1 space-y-6">
              
              {/* Contact Box */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 border-b border-gray-200 pb-2">Contact Info</h3>
                <div className="space-y-4">
                  <InfoItem icon={Mail} label="Email" value={profileData.email} />
                  <InfoItem icon={Phone} label="Phone" value={profileData.phone} />
                  <InfoItem icon={MapPin} label="Location" value={profileData.address} />
                  <InfoItem icon={Globe} label="Website" value={profileData.website} isLink />
                </div>
              </div>

              {/* Social Box */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 border-b border-gray-200 pb-2">Social Media</h3>
                <div className="space-y-4">
                  <InfoItem icon={Linkedin} label="LinkedIn" value={profileData.linkedin} isLink />
                  <InfoItem icon={Github} label="GitHub" value={profileData.github} isLink />
                </div>
              </div>

            </div>

            {/* Right Column: Bio & Skills */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Biography */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Biography</h3>
                <p className="text-gray-600 leading-relaxed bg-white p-4 border border-gray-100 rounded-lg">
                  {profileData.bio}
                </p>
              </div>

              {/* Experience & Skills Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={18} className="text-blue-600" />
                    <h3 className="font-bold text-gray-900">Experience</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{profileData.experience}</p>
                </div>

                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={18} className="text-purple-600" />
                    <h3 className="font-bold text-gray-900">Key Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.split(',').map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-white text-purple-700 text-xs font-bold rounded border border-purple-100 shadow-sm">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>

      {/* 4. Embed Edit Modal */}
      <CandidateProfileEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />

    </div>
  );
};

// Sub-component for Cleaner Code
const InfoItem = ({ icon: Icon, label, value, isLink }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400"><Icon size={16} /></div>
      <div className="flex-1 overflow-hidden">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        {isLink ? (
          <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 hover:underline truncate block">
            {value}
          </a>
        ) : (
          <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;