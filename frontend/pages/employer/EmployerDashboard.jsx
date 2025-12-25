import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployerJobs } from '../../services/employerService';
import { Briefcase, Users, Eye, TrendingUp } from 'lucide-react';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalViews: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getEmployerJobs();
      const jobs = data.jobs || data || [];

      // Calculate statistics
      const activeJobs = jobs.filter(
        (job) => job.status === 'active' || !job.status
      ).length;
      const totalApplications = jobs.reduce(
        (sum, job) => sum + (job.applications_count || 0),
        0
      );
      const totalViews = jobs.reduce((sum, job) => sum + (job.views_count || 0), 0);

      setStats({
        totalJobs: jobs.length,
        activeJobs,
        totalApplications,
        totalViews,
      });

      // Get the 5 most recent jobs
      setRecentJobs(jobs.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's an overview of your job postings.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            label="Total Jobs"
            value={stats.totalJobs}
            color="bg-blue-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Active Jobs"
            value={stats.activeJobs}
            color="bg-green-500"
          />
          <StatCard
            icon={Users}
            label="Total Applications"
            value={stats.totalApplications}
            color="bg-purple-500"
          />
          <StatCard
            icon={Eye}
            label="Total Views"
            value={stats.totalViews}
            color="bg-orange-500"
          />
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
            <button
              onClick={() => navigate('/employer/jobs')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs posted yet</h3>
              <p className="mt-2 text-gray-600">Get started by creating your first job posting</p>
              <button
                onClick={() => navigate('/employer/jobs/create')}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span>{job.location}</span>
                        {job.employment_type && (
                          <>
                            <span>•</span>
                            <span>{job.employment_type}</span>
                          </>
                        )}
                        {job.applications_count !== undefined && (
                          <>
                            <span>•</span>
                            <span>{job.applications_count} applications</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'active' || !job.status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {job.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/employer/jobs/create')}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Post a New Job</h3>
                <p className="text-sm text-gray-600">Create a new job posting</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/employer/jobs')}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Jobs</h3>
                <p className="text-sm text-gray-600">View and edit your postings</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/candidates')}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Browse Candidates</h3>
                <p className="text-sm text-gray-600">Find qualified candidates</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
