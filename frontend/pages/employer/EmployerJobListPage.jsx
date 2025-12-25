import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmployerJobs, deleteJob } from '../../services/employerService';
import { Pencil, Trash2, Plus, Eye, Users, MapPin, Calendar, DollarSign, Building2 } from 'lucide-react';

const EmployerJobListPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch employer's jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getEmployerJobs();
      setJobs(data.jobs || data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Error loading jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      setDeleting(true);
      await deleteJob(jobToDelete.id);
      toast.success('Job deleted successfully!');

      // Remove the deleted job from the list
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobToDelete.id));
      setDeleteModalOpen(false);
      setJobToDelete(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Error deleting job. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800',
      expired: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusColors[status?.toLowerCase()] || statusColors.active
        }`}
      >
        {status || 'Active'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Posted Jobs</h1>
            <p className="mt-2 text-gray-600">
              Manage your job postings and track applications ({jobs.length} jobs)
            </p>
          </div>
          <button
            onClick={() => navigate('/employer/jobs/create')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={20} />
            Create New Job
          </button>
        </div>

        {/* Job List */}
        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-6">Start by posting your first job to attract talented candidates.</p>
            <button
              onClick={() => navigate('/employer/jobs/create')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
            >
              <Plus size={20} />
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onDelete={handleDeleteClick} navigate={navigate} />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="text-red-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Job</h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the job{' '}
                <span className="font-semibold">"{jobToDelete?.title}"</span>? This action
                cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete Job'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// JobCard Component
const JobCard = ({ job, onDelete, navigate }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      closed: { color: 'bg-red-100 text-red-800', label: 'Closed' },
      expired: { color: 'bg-yellow-100 text-yellow-800', label: 'Expired' },
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Job Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer"
              onClick={() => navigate(`/jobs/${job.id}`)}>
            {job.title}
          </h3>
          {job.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
              {job.category}
            </span>
          )}
        </div>
        {getStatusBadge(job.status)}
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-4">
        {job.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-gray-400" />
            <span>{job.location}</span>
          </div>
        )}
        
        {job.employment_type && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 size={16} className="text-gray-400" />
            <span>{job.employment_type}</span>
          </div>
        )}

        {job.salary_min && job.salary_max && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign size={16} className="text-gray-400" />
            <span>{job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} VND</span>
          </div>
        )}

        {job.deadline && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-gray-400" />
            <span>Deadline: {formatDate(job.deadline)}</span>
          </div>
        )}
      </div>

      {/* Application Stats */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{job.applications_count || 0}</span> applications
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{job.views_count || 0}</span> views
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/employer/jobs/${job.id}/applications`)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Users size={16} />
          View Applications ({job.applications_count || 0})
        </button>
        
        <button
          onClick={() => navigate(`/jobs/${job.id}`)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="View Job"
        >
          <Eye size={18} />
        </button>
        
        <button
          onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="Edit Job"
        >
          <Pencil size={18} />
        </button>
        
        <button
          onClick={() => onDelete(job)}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Delete Job"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default EmployerJobListPage;
