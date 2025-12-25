import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Download, MoreVertical } from 'lucide-react';
import {
  getJobApplications,
  updateApplicationStatus,
  saveCandidate,
  downloadCV,
} from '../../services/candidateService';
import CandidateDetailModal from '../../components/employer/CandidateDetailModal';
import InterviewScheduleModal from '../../components/employer/InterviewScheduleModal';

const JobApplicationsPage = () => {
  const { jobId } = useParams();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewApplication, setInterviewApplication] = useState(null);

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await getJobApplications(jobId);
      console.log('API Response:', response); // Debug log
      
      // Handle the new API response format
      if (response.success && response.data) {
        setApplications(response.data.applications || []);
      } else {
        setApplications(response.applications || response || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Error loading applications: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(jobId, applicationId, newStatus);
      toast.success(`Application ${newStatus.toLowerCase()} successfully!`);

      // If status is INTERVIEW, open interview scheduling modal
      if (newStatus === 'INTERVIEW') {
        const app = applications.find((a) => a.id === applicationId);
        setInterviewApplication(app);
        setShowInterviewModal(true);
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error?.message || 'Error updating application status');
    }
  };

  const handleSaveCandidate = async (candidateId) => {
    try {
      await saveCandidate(candidateId, jobId);
      toast.success('Candidate saved successfully!');
    } catch (error) {
      console.error('Error saving candidate:', error);
      toast.error(error?.message || 'Error saving candidate');
    }
  };

  const handleDownloadCV = async (cvUrl, candidateName) => {
    try {
      const blob = await downloadCV(cvUrl);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${candidateName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('CV downloaded successfully!');
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Error downloading CV');
    }
  };

  const handleViewDetail = (application) => {
    setSelectedCandidate(application);
    setShowDetailModal(true);
  };

  const getApplicationsByStatus = (status) => {
    if (status === 'ALL') {
      return applications;
    }
    return applications.filter((app) => app.status === status);
  };

  const ApplicationCard = ({ application }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            {application.candidate_name?.[0]?.toUpperCase() || 'C'}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <button
              onClick={() => handleViewDetail(application)}
              className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors text-left"
            >
              {application.candidate_name}
            </button>
            <p className="text-sm text-gray-600 mt-1">
              {application.candidate_title || 'Candidate'}
            </p>

            {/* Experience and Education */}
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              {application.experience && (
                <p>• {application.experience} Experience</p>
              )}
              {application.education && (
                <p>• Education: {application.education}</p>
              )}
              {application.applied_date && (
                <p>
                  • Applied: {new Date(application.applied_date).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Download CV Button */}
            {application.cv_url && (
              <button
                onClick={() =>
                  handleDownloadCV(application.cv_url, application.candidate_name)
                }
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mt-3"
              >
                <Download size={16} />
                Download CV
              </button>
            )}
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical size={20} className="text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    handleSaveCandidate(application.candidate_id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                >
                  Save Candidate
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleViewDetail(application);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                >
                  View Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const StatusColumn = ({ status, title, count }) => {
    const apps = getApplicationsByStatus(status);

    return (
      <div className="flex-1 min-w-[300px]">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Column Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">
              {title} ({apps.length})
            </h3>
          </div>

          {/* Applications List */}
          <div className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
            {apps.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No applications</p>
            ) : (
              apps.map((app) => (
                <div key={app.id}>
                  <ApplicationCard application={app} />

                  {/* Status Change Buttons */}
                  {status !== 'ALL' && (
                    <div className="flex gap-2 mt-2">
                      {status !== 'APPROVED' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'APPROVED')}
                          className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                      )}
                      {status !== 'DECLINED' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'DECLINED')}
                          className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                        >
                          Decline
                        </button>
                      )}
                      {status !== 'INTERVIEW' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'INTERVIEW')}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                          Interview
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="mt-2 text-gray-600">
            Manage applications for this position ({applications.length} total)
          </p>
        </div>

        {/* Kanban Board - 4 Columns */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          <StatusColumn
            status="ALL"
            title="All Applications"
            count={applications.length}
          />
          <StatusColumn
            status="APPROVED"
            title="Approved"
            count={getApplicationsByStatus('APPROVED').length}
          />
          <StatusColumn
            status="DECLINED"
            title="Declined"
            count={getApplicationsByStatus('DECLINED').length}
          />
          <StatusColumn
            status="INTERVIEW"
            title="Interview"
            count={getApplicationsByStatus('INTERVIEW').length}
          />
        </div>

        {/* Candidate Detail Modal */}
        {showDetailModal && selectedCandidate && (
          <CandidateDetailModal
            candidate={selectedCandidate}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedCandidate(null);
            }}
            onStatusChange={handleStatusChange}
            onSave={() => handleSaveCandidate(selectedCandidate.candidate_id)}
            onScheduleInterview={() => {
              setInterviewApplication(selectedCandidate);
              setShowDetailModal(false);
              setShowInterviewModal(true);
            }}
            onDownloadCV={() =>
              handleDownloadCV(
                selectedCandidate.cv_url,
                selectedCandidate.candidate_name
              )
            }
          />
        )}

        {/* Interview Schedule Modal */}
        {showInterviewModal && interviewApplication && (
          <InterviewScheduleModal
            application={interviewApplication}
            onClose={() => {
              setShowInterviewModal(false);
              setInterviewApplication(null);
            }}
            onSuccess={() => {
              fetchApplications();
              setShowInterviewModal(false);
              setInterviewApplication(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default JobApplicationsPage;
