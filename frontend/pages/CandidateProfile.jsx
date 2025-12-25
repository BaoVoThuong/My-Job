import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Globe, Linkedin, Github, Edit, Calendar } from 'lucide-react';
import userService from '../services/userService';

// 1. Import Modal Component
import CandidateProfileEditModal from '../components/CandidateProfileEditModal';

const CandidateProfile = () => {
  // 2. State to toggle Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data from API
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      if (response.success) {
        setProfileData(response.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto font-sans flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto font-sans flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No profile data
  if (!profileData) {
    return (
      <div className="p-6 max-w-5xl mx-auto font-sans flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No profile data found</p>
      </div>
    );
  }

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
              <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white shadow-md text-white text-4xl font-bold">
                {profileData.fullName?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>

            <div className="flex-1 mb-2">
              <h2 className="text-3xl font-bold text-gray-900">{profileData.fullName || 'No Name'}</h2>
              <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                <Briefcase size={16} className="text-blue-600" />
                {profileData.headline || 'No headline'}
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
                </div>
              </div>

              {/* CV Section */}
              {profileData.cv && (
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 border-b border-gray-200 pb-2">CV/Resume</h3>
                  <a
                    href={profileData.cv}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-2"
                  >
                    <Globe size={16} />
                    View CV
                  </a>
                </div>
              )}

            </div>

            {/* Right Column: Summary & Skills */}
            <div className="md:col-span-2 space-y-8">

              {/* Summary */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Summary</h3>
                <p className="text-gray-600 leading-relaxed bg-white p-4 border border-gray-100 rounded-lg">
                  {profileData.summary || 'No summary provided'}
                </p>
              </div>

              {/* Skills */}
              <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={18} className="text-purple-600" />
                  <h3 className="font-bold text-gray-900">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-white text-purple-700 text-sm font-semibold rounded-lg border border-purple-200 shadow-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No skills added</span>
                  )}
                </div>
              </div>

              {/* Work Experience */}
              {profileData.workExperience && profileData.workExperience.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Work Experience</h3>
                  <div className="space-y-4">
                    {profileData.workExperience.map((work, index) => (
                      <div key={index} className="bg-white p-4 border border-gray-100 rounded-lg">
                        <h4 className="font-bold text-gray-900">{work.position}</h4>
                        <p className="text-blue-600 text-sm font-semibold">{work.company}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {work.startDate} - {work.endDate || 'Present'}
                        </p>
                        {work.description && (
                          <p className="text-gray-600 text-sm mt-2">{work.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {profileData.education && profileData.education.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Education</h3>
                  <div className="space-y-4">
                    {profileData.education.map((edu, index) => (
                      <div key={index} className="bg-white p-4 border border-gray-100 rounded-lg">
                        <h4 className="font-bold text-gray-900">{edu.school}</h4>
                        <p className="text-blue-600 text-sm font-semibold">{edu.degree}</p>
                        {edu.GPA && (
                          <p className="text-gray-600 text-sm">GPA: {edu.GPA}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          {edu.startDate} - {edu.endDate || 'Present'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
          
        </div>
      </div>

      {/* 4. Embed Edit Modal */}
      <CandidateProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => fetchProfile()}
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