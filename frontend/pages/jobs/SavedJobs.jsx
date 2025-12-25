import { useEffect, useState, useCallback } from "react";
import jobService from "../../services/jobService";
import { useNavigate } from "react-router-dom";

export default function SavedJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSavedJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await jobService.getSavedJobs(page, limit);

      setJobs(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
      setError("Không thể tải danh sách việc làm đã lưu");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  const handleUnsave = async (jobId, e) => {
    e.stopPropagation();
    try {
      await jobService.unsaveJob(jobId);
      // Refresh the list after unsaving
      fetchSavedJobs();
    } catch (err) {
      console.error("Error unsaving job:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Saved Jobs</h1>

        {loading && <p className="text-center py-10">Loading saved jobs...</p>}
        {error && <p className="text-red-500 text-center py-10">{error}</p>}
        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">You haven't saved any jobs yet.</p>
            <button
              onClick={() => navigate('/find-job')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Jobs
            </button>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/job/${job.id}`)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-pink-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-pink-600 text-xl">📱</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                      {job.company_name && (
                        <p className="text-sm text-gray-500">{job.company_name}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleUnsave(job.id, e)}
                      className="text-black hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center">
                      <span className="mr-2">📍</span>
                      {job.location}
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">💰</span>
                      {job.salary_min && job.salary_max
                        ? `$${job.salary_min?.toLocaleString()} - $${job.salary_max?.toLocaleString()}`
                        : 'Negotiable'}
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">⏰</span>
                      {new Date(job.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                      {job.job_type || 'Full Time'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/job/${job.id}`);
                      }}
                      className="text-blue-600 text-sm font-semibold hover:text-blue-700"
                    >
                      Apply Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ←
                </button>

                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
