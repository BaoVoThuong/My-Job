import React, { useEffect, useState, useRef } from 'react';
import profileService from '../services/profileService';
import CVUploadBox from '../components/CVUploadBox';
import { X, User, MapPin, Phone, Mail, Globe, Calendar, Flag, Heart, Briefcase } from 'lucide-react'; // Cài: npm install lucide-react

const CandidateProfileEditModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    headline: '',
    summary: '', // Biography
    coverLetter: '', // Cover Letter
    skills: '',
    dob: '',
    nationality: '',
    maritalStatus: '',
    gender: '',
    experience: '',
    education: '',
    website: '',
    location: '',
    cvUrl: ''
  });

  // Fetch data mỗi khi mở Modal
  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const data = await profileService.getProfile();
          // Map dữ liệu từ API vào form (đảm bảo field nào cũng có giá trị mặc định)
          setFormData(prev => ({ ...prev, ...data }));
        } catch (error) {
          console.error("Lỗi lấy dữ liệu:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadCVSuccess = (url) => {
    setFormData(prev => ({ ...prev, cvUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileService.updateProfile(formData);
      alert('Cập nhật thành công!');
      onClose(); // Đóng modal sau khi lưu xong
    } catch (error) {
      alert(error.message);
    }
  };

  // Nếu modal chưa mở thì không render gì cả
  if (!isOpen) return null;

  return (
    // 1. Overlay tối màu (fixed inset-0)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      
      {/* 2. Modal Container (Trắng, bo góc, bóng đổ) */}
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden animate-fade-in-up">
        
        {/* Nút đóng (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition z-10"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Header (Avatar & Name - Giống ảnh Figma) */}
        <div className="p-8 pb-0 flex items-center gap-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
             {/* Thay bằng thẻ img nếu có avatarUrl */}
             <User className="w-full h-full p-4 text-gray-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{formData.fullName || 'Tên ứng viên'}</h2>
            <p className="text-gray-500">{formData.headline || 'Chưa cập nhật chức danh'}</p>
          </div>
        </div>

        {/* Body (Cuộn được) */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {loading ? (
            <div className="text-center py-20">Đang tải dữ liệu...</div>
          ) : (
            <form id="profileForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* --- CỘT TRÁI (Lớn - Biography & Cover Letter) --- */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Biography */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-3">Biography</label>
                  <textarea 
                    name="summary" rows="6"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 leading-relaxed"
                    placeholder="Viết mô tả ngắn về bản thân..."
                    value={formData.summary} onChange={handleChange}
                  />
                </div>

                {/* Cover Letter */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-3">Cover Letter</label>
                  <textarea 
                    name="coverLetter" rows="8"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 leading-relaxed"
                    placeholder="Nội dung thư xin việc..."
                    value={formData.coverLetter} onChange={handleChange}
                  />
                </div>

              </div>

              {/* --- CỘT PHẢI (Nhỏ - Personal & Contact Info) --- */}
              <div className="space-y-6">
                
                {/* Personal Information Box */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Personal Information</h3>
                   
                   <div className="grid grid-cols-1 gap-4">
                      <InputIcon icon={Calendar} label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                      <InputIcon icon={Flag} label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
                      <InputIcon icon={Heart} label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} />
                      <InputIcon icon={User} label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
                      <InputIcon icon={Briefcase} label="Experience" name="experience" value={formData.experience} onChange={handleChange} />
                   </div>
                </div>

                {/* CV Upload */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Download My Resume</h3>
                  <CVUploadBox currentCvUrl={formData.cvUrl} onUploadSuccess={handleUploadCVSuccess} />
                </div>

                {/* Contact Information Box */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Contact Information</h3>
                   <div className="space-y-3">
                      <InputIcon icon={Globe} label="Website" name="website" value={formData.website} onChange={handleChange} />
                      <InputIcon icon={MapPin} label="Location" name="location" value={formData.location} onChange={handleChange} />
                      <InputIcon icon={Phone} label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                      <InputIcon icon={Mail} label="Email Address" name="email" value={formData.email} onChange={handleChange} />
                   </div>
                </div>

              </div>
            </form>
          )}
        </div>

        {/* Footer (Nút Save) */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button 
            type="submit" 
            form="profileForm" // Link tới form ID phía trên
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200"
          >
            Save Profile
          </button>
        </div>

      </div>
    </div>
  );
};

// Component phụ để render input có icon
const InputIcon = ({ icon: Icon, label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-gray-400">{label}</label>
    <div className="relative group">
       <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />
       <input 
         className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-all"
         {...props}
       />
    </div>
  </div>
);

export default CandidateProfileEditModal;