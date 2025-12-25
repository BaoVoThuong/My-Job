import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Trash2, Eye, Download, Mail } from 'lucide-react';
import {
  getSavedCandidates,
  unsaveCandidate,
  downloadCV,
} from '../../services/candidateService';
import CandidateDetailModal from '../../components/employer/CandidateDetailModal';

const SavedCandidatesPage = () => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  useEffect(() => {
    fetchSavedCandidates();
  }, []);

  const fetchSavedCandidates = async () => {
    try {
      setLoading(true);
      const data = await getSavedCandidates();
      setCandidates(data.candidates || data || []);
    } catch (error) {
      console.error('Error fetching saved candidates:', error);
      toast.error('Error loading saved candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (candidateId) => {
    try {
      await unsaveCandidate(candidateId);
      toast.success('Candidate removed from saved list');
      setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
      setDeleteModalOpen(false);
      setCandidateToDelete(null);
    } catch (error) {
      console.error('Error removing candidate:', error);
      toast.error('Error removing candidate');
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

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (candidate) => {
    setCandidateToDelete(candidate);
    setDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading saved candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Candidates</h1>
          <p className="mt-2 text-gray-600">
            Manage your saved candidates ({candidates.length} total)
          </p>
        </div>

        {/* Candidates List */}
        {candidates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No saved candidates yet
              </h3>
              <p className="mt-2 text-gray-600">
                Start saving promising candidates for future opportunities
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {/* Avatar & Name */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {candidate.name?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-gray-600">{candidate.title}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  {candidate.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>{candidate.email}</span>
                    </div>
                  )}
                  {candidate.experience && <p>• {candidate.experience} Experience</p>}
                  {candidate.education && <p>• {candidate.education}</p>}
                  {candidate.saved_date && (
                    <p className="text-xs text-gray-500">
                      Saved on {new Date(candidate.saved_date).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewProfile(candidate)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Eye size={16} />
                    View Profile
                  </button>
                  {candidate.cv_url && (
                    <button
                      onClick={() => handleDownloadCV(candidate.cv_url, candidate.name)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      title="Download CV"
                    >
                      <Download size={18} className="text-gray-600" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(candidate)}
                    className="p-2 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && candidateToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="text-red-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Remove Saved Candidate
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to remove{' '}
                <span className="font-semibold">{candidateToDelete.name}</span> from
                your saved candidates?
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setCandidateToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUnsave(candidateToDelete.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Detail Modal */}
        {showDetailModal && selectedCandidate && (
          <CandidateDetailModal
            candidate={selectedCandidate}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedCandidate(null);
            }}
            onStatusChange={() => {}}
            onSave={() => {}}
            onScheduleInterview={() => {}}
            onDownloadCV={() =>
              handleDownloadCV(selectedCandidate.cv_url, selectedCandidate.name)
            }
          />
        )}
      </div>
    </div>
  );
};

export default SavedCandidatesPage;
