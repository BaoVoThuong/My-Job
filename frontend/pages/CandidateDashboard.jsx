import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Heart, Bell, MapPin, DollarSign, Calendar, Clock } from 'lucide-react';
import api from '../services/api';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    appliedJobs: 0,
    favoriteJobs: 0,
    jobAlerts: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get user info
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);

      // Fetch dashboard stats
      const statsResponse = await api.get('/candidate/dashboard/stats');
      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      // Fetch recent jobs
      const jobsResponse = await api.get('/candidate/recent-jobs?limit=3');
      if (jobsResponse.data.success) {
        setRecentJobs(jobsResponse.data.jobs);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor, onClick }) => (
    <div
      onClick={onClick}
      className={`${bgColor} rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${color} mb-2`}>{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={color} size={32} />
        </div>
      </div>
    </div>
  );

  const JobCard = ({ job }) => {
    const formatSalary = (min, max) => {
      if (!min && !max) return 'Negotiable';
      if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
      if (min) return `From $${min.toLocaleString()}`;
      return `Up to $${max.toLocaleString()}`;
    };

    const getTimeAgo = (date) => {
      const now = new Date();
      const posted = new Date(date);
      const diffInMs = now - posted;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      return `${Math.floor(diffInDays / 30)} months ago`;
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3
              onClick={() => navigate(`/job/${job.id}`)}
              className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer mb-2"
            >
              {job.title}
            </h3>
            <p className="text-gray-600 font-medium mb-2">{job.company_name}</p>
          </div>
          {job.is_applied && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              Applied
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign size={16} />
            <span className="text-sm">{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} />
            <span className="text-sm capitalize">{job.job_type}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={14} />
            Posted {getTimeAgo(job.created_at)}
          </span>

          {job.is_applied ? (
            <button
              disabled
              className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg font-semibold cursor-not-allowed"
            >
              Applied
            </button>
          ) : (
            <button
              onClick={() => navigate(`/job/${job.id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hello, {user?.fullname || 'Candidate'}
          </h1>
          <p className="text-gray-600">Here is your daily activities and job alerts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            title="Applied Jobs"
            value={stats.appliedJobs}
            color="text-blue-600"
            bgColor="bg-blue-50"
            onClick={() => navigate('/find-job')}
          />
          <StatCard
            icon={Heart}
            title="Favorite Jobs"
            value={stats.favoriteJobs}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
            onClick={() => navigate('/saved-jobs')}
          />
          <StatCard
            icon={Bell}
            title="Job Alerts"
            value={stats.jobAlerts}
            color="text-green-600"
            bgColor="bg-green-50"
            onClick={() => navigate('/job-alerts')}
          />
        </div>

        {/* Recently Posted Jobs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recently Posted</h2>
            <button
              onClick={() => navigate('/find-job')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              View all →
            </button>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="mx-auto mb-4 text-gray-400" size={48} />
              <p>No jobs available yet</p>
              <button
                onClick={() => navigate('/find-job')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CandidateDashboard;
