import React, { useEffect, useState } from 'react';
import { X, User, Calendar, Flag, Heart, Briefcase, Globe, MapPin, Phone, Mail } from 'lucide-react';
import profileService from '../services/profileService';
import CVUploadBox from './CVUploadBox';

const CandidateProfileEditModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      profileService.getProfile().then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [isOpen]);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Header Modal */}
        <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={32} className="text-gray-500"/>
            </div>
            <div>
              <h2 className="text-xl font-bold">{data.fullName}</h2>
              <p className="text-gray-500 text-sm">{data.headline}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X/></button>
        </div>

        {/* Nội dung Form (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {loading ? <p>Loading...</p> : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* CỘT TRÁI (LỚN) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <label className="block font-bold text-sm text-gray-700 mb-2 uppercase">Biography</label>
                  <textarea name="bio" rows="6" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.bio || ''} onChange={handleChange} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <label className="block font-bold text-sm text-gray-700 mb-2 uppercase">Cover Letter</label>
                  <textarea name="coverLetter" rows="8" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.coverLetter || ''} onChange={handleChange} />
                </div>
              </div>

              {/* CỘT PHẢI (NHỎ) */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-sm text-gray-700 uppercase mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <InputIcon icon={Calendar} label="Date of Birth" type="date" name="dob" value={data.dob} onChange={handleChange} />
                    <InputIcon icon={Flag} label="Nationality" name="nationality" value={data.nationality} onChange={handleChange} />
                    <InputIcon icon={Heart} label="Marital Status" name="maritalStatus" value={data.maritalStatus} onChange={handleChange} />
                    <InputIcon icon={User} label="Gender" name="gender" value={data.gender} onChange={handleChange} />
                    <InputIcon icon={Briefcase} label="Experience" name="experience" value={data.experience} onChange={handleChange} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                   <h3 className="font-bold text-sm text-gray-700 uppercase mb-4">Resume</h3>
                   <CVUploadBox currentCvUrl={data.cvUrl} onUploadSuccess={(url) => setData({...data, cvUrl: url})}/>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                   <h3 className="font-bold text-sm text-gray-700 uppercase mb-4">Contact</h3>
                   <div className="space-y-4">
                      <InputIcon icon={Globe} label="Website" name="website" value={data.website} onChange={handleChange}/>
                      <InputIcon icon={MapPin} label="Location" name="location" value={data.location} onChange={handleChange}/>
                      <InputIcon icon={Phone} label="Phone" name="phone" value={data.phone} onChange={handleChange}/>
                      <InputIcon icon={Mail} label="Email" name="email" value={data.email} onChange={handleChange}/>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
          <button onClick={() => { profileService.updateProfile(data); onClose(); }} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200">Save Profile</button>
        </div>
      </div>
    </div>
  );
};

// Component con input nhỏ
const InputIcon = ({ icon: Icon, label, ...props }) => (
  <div>
    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-3 text-blue-500"/>
      <input className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500 transition" {...props}/>
    </div>
  </div>
);

export default CandidateProfileEditModal;