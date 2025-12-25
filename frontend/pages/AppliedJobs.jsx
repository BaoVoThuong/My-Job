import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, Clock, Eye } from 'lucide-react';
import api from '../services/api';

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Call API to get applied jobs
      const response = await api.get('/candidate/applied-jobs');
      
      if (response.data.success) {
        setAppliedJobs(response.data.data || []);
      } else {
        setError('Failed to load applied jobs');
      }
    } catch (err) {
      console.error('Error fetching applied jobs:', err);
      setError('Unable to load applied jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} VND`;
    }
    return 'Negotiable';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      reviewing: { color: 'bg-blue-100 text-blue-800', text: 'Reviewing' },
      interviewed: { color: 'bg-purple-100 text-purple-800', text: 'Interviewed' },
      accepted: { color: 'bg-green-100 text-green-800', text: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applied jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchAppliedJobs}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applied Jobs</h1>
          <p className="text-gray-600">
            Track your job applications and their current status
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{appliedJobs.length}</div>
            <div className="text-sm text-gray-600">Total Applied</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">
              {appliedJobs.filter(job => job.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {appliedJobs.filter(job => job.status === 'accepted').length}
            </div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-red-600">
              {appliedJobs.filter(job => job.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Applied Jobs List */}
        {appliedJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applied Jobs</h3>
            <p className="text-gray-600 mb-6">You haven't applied for any jobs yet.</p>
            <button 
              onClick={() => navigate('/find-job')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Find Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appliedJobs.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-xl">
                        {application.job?.title?.charAt(0) || 'J'}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {application.job?.title || 'Job Title'}
                          </h3>
                          <p className="text-gray-600">
                            {application.job?.company_name || 'Company Name'}
                          </p>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                      
                      <div className="flex gap-6 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {application.job?.location || 'Location'}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={16} />
                          {formatSalary(application.job?.salary_min, application.job?.salary_max)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          Applied: {formatDate(application.created_at)}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                          {application.job?.job_type || 'Full Time'}
                        </span>
                        {application.job?.experience_level && (
                          <span className="text-xs px-3 py-1 bg-gray-50 text-gray-600 rounded-full">
                            {application.job.experience_level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/job/${application.job?.id}`)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Job
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;