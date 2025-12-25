import { X, Download, Bookmark, Calendar, Mail, Phone, MapPin, Briefcase, Star, Globe, GraduationCap, User } from 'lucide-react';

const CandidateDetailModal = ({
  candidate,
  onClose,
  onStatusChange,
  onSave,
  onScheduleInterview,
  onDownloadCV,
}) => {
  const handleStatusChange = (status) => {
    onStatusChange(candidate.id, status);
    if (status !== 'INTERVIEW') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {candidate.candidate_name?.[0]?.toUpperCase() || 'C'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {candidate.candidate_name}
              </h2>
              <p className="text-gray-600">{candidate.candidate_title || 'Candidate'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              <Star size={18} />
              Save
            </button>
            <button
              onClick={() => onDownloadCV && onDownloadCV()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              Download My Resume
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Biography Section */}
              <div className="bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">BIOGRAPHY</h3>
                <p className="text-gray-700 leading-relaxed">
                  {candidate.bio || candidate.summary || candidate.biography || "I've been passionate about graphic design and digital art from an early age with a keen interest in Website and Mobile Application User Interfaces, I can create high-quality and aesthetically pleasing designs in quick turnaround time. Check out the portfolio section of my profile to see samples of my work and feel free to discuss your design needs. I mostly use Adobe Photoshop, Illustrator, XD and Figma. *Website User Experience and Interface (UI/UX) Design - for all kinds of iOS/Android and Hybrid Mobile Applications. *Wireframe Designs"}
                </p>
              </div>

              {/* Cover Letter Section */}
              <div className="bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">COVER LETTER</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    Dear Sir,
                  </p>
                  <br />
                  <p className="text-gray-700 leading-relaxed">
                    {candidate.cover_letter || "I am writing to express my interest in the fourth grade instructional position that is currently available in the Fort Wayne Community School System. I learned of this opportunity through a notice posted on JobZone. HT-IVD job database. I am confident that my academic background and curriculum development skills would be successful utilized in this teaching position."}
                  </p>
                  <br />
                  <p className="text-gray-700 leading-relaxed">
                    I have just completed my Bachelor of Science degree in Elementary Education and have successfully completed Praxis I and Praxis II. During my student teaching experience, I developed and initiated a three-week curriculum sequence on animal species and earth resources. This collaborative and involved working with three other third grade teachers within my team, and culminated in a field trip to the Indianapolis Zoo Animal Research Unit.
                  </p>
                  <br />
                  <p className="text-gray-700">Sincerely,</p>
                  <p className="text-gray-700">{candidate.candidate_name}</p>
                </div>
              </div>

              {/* Follow Social Media */}
              <div className="bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow me Social Media</h3>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">f</span>
                  </div>
                  <div className="w-10 h-10 bg-blue-400 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">t</span>
                  </div>
                  <div className="w-10 h-10 bg-blue-700 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">in</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">◐</span>
                  </div>
                  <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">b</span>
                  </div>
                  <div className="w-10 h-10 bg-red-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">▶</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details & Actions */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs text-blue-600 font-medium">DATE OF BIRTH</p>
                    <p className="text-sm font-semibold text-gray-900">14 June, 2021</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-blue-600 font-medium">NETWORKS</p>
                      <p className="text-sm font-semibold text-gray-900">Bangladesh</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-blue-600 font-medium">SALARY</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {candidate.expected_salary || 'Negotiable'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-blue-600 font-medium">EXPERIENCE</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {candidate.experience || '7 Years'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-blue-600 font-medium">EDUCATION</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {candidate.education || 'Master Degree'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                <div className="space-y-3">
                  {candidate.candidate_email && (
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-blue-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">EMAIL ADDRESS</p>
                        <p className="text-sm font-medium text-gray-900">{candidate.candidate_email}</p>
                      </div>
                    </div>
                  )}

                  {candidate.candidate_phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-blue-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">PHONE</p>
                        <p className="text-sm font-medium text-gray-900">{candidate.candidate_phone}</p>
                      </div>
                    </div>
                  )}

                  {candidate.candidate_location && (
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-blue-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">LOCATION</p>
                        <p className="text-sm font-medium text-gray-900">{candidate.candidate_location}</p>
                      </div>
                    </div>
                  )}

                  {candidate.linkedin_url && (
                    <div className="flex items-center gap-3">
                      <Globe size={16} className="text-blue-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">WEBSITE</p>
                        <p className="text-sm font-medium text-blue-600">
                          <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer">
                            www.estherhoward.com
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Status Actions */}
              <div className="bg-white">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleStatusChange('APPROVED')}
                    disabled={candidate.status === 'APPROVED'}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    Hire Candidates
                  </button>
                  <button
                    onClick={() => handleStatusChange('INTERVIEW')}
                    disabled={candidate.status === 'INTERVIEW'}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => handleStatusChange('DECLINED')}
                    disabled={candidate.status === 'DECLINED'}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    Decline Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailModal;
