import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import userService from '../services/userService';

const CandidateProfileEditModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    headline: '',
    summary: '',
    skills: [],
    workExperience: [],
    education: [],
    cv: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Fetch profile data when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      userService.getProfile()
        .then(res => {
          if (res.success) {
            setFormData({
              fullName: res.data.fullName || '',
              email: res.data.email || '',
              phone: res.data.phone || '',
              headline: res.data.headline || '',
              summary: res.data.summary || '',
              skills: res.data.skills || [],
              workExperience: res.data.workExperience || [],
              education: res.data.education || [],
              cv: res.data.cv || ''
            });
          }
        })
        .catch(err => console.error('Error fetching profile:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Skills management
  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });
  };

  // Work Experience management
  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [...formData.workExperience, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    });
  };

  const updateWorkExperience = (index, field, value) => {
    const updated = [...formData.workExperience];
    updated[index][field] = value;
    setFormData({ ...formData, workExperience: updated });
  };

  const removeWorkExperience = (index) => {
    setFormData({ ...formData, workExperience: formData.workExperience.filter((_, i) => i !== index) });
  };

  // Education management
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, {
        school: '',
        degree: '',
        GPA: '',
        startDate: '',
        endDate: ''
      }]
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...formData.education];
    updated[index][field] = value;
    setFormData({ ...formData, education: updated });
  };

  const removeEducation = (index) => {
    setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await userService.updateProfile(formData);
      if (response.success) {
        alert('Profile updated successfully!');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading...</p>
            </div>
          ) : (
            <>
              {/* Basic Info */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                      placeholder="e.g. Senior Frontend Developer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CV/Resume URL</label>
                  <input
                    type="text"
                    name="cv"
                    value={formData.cv}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4">Skills</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2 text-sm font-semibold"
                    >
                      {skill}
                      <button onClick={() => removeSkill(index)} className="hover:text-red-600">
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900">Work Experience</h3>
                  <button
                    onClick={addWorkExperience}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.workExperience.map((work, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-700">Experience #{index + 1}</h4>
                        <button
                          onClick={() => removeWorkExperience(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={work.company}
                          onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                          placeholder="Company"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <input
                          type="text"
                          value={work.position}
                          onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                          placeholder="Position"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <input
                          type="date"
                          value={work.startDate}
                          onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                          placeholder="Start Date"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <input
                          type="date"
                          value={work.endDate}
                          onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                          placeholder="End Date"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </div>
                      <textarea
                        value={work.description}
                        onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                        placeholder="Description"
                        rows="2"
                        className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900">Education</h3>
                  <button
                    onClick={addEducation}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-700">Education #{index + 1}</h4>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(index, 'school', e.target.value)}
                          placeholder="School"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          placeholder="Degree"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <input
                          type="text"
                          value={edu.GPA}
                          onChange={(e) => updateEducation(index, 'GPA', e.target.value)}
                          placeholder="GPA (e.g. 3.5)"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <input
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                          placeholder="Start Date"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <input
                          type="date"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                          placeholder="End Date"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm col-span-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileEditModal;
