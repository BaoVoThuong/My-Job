import { useEffect, useState, useCallback } from "react";
import { getJobs } from "../../services/jobService";
import jobService from "../../services/jobService";
import { useNavigate } from "react-router-dom";

/* =======================
   UTIL: debounce hook
======================= */
function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/* =======================
   ADVANCE FILTER MODAL
======================= */
function AdvanceFilterModal({ isOpen, onClose, filters, setFilters, onApply }) {
  if (!isOpen) return null;

  const salaryRanges = [
    { label: '100K - 1M VND', min: 100, max: 1000 },
    { label: '1M - 2M VND', min: 1000, max: 2000 },
    { label: '2M - 5M VND', min: 2000, max: 5000 },
    { label: '5M - 10M VND', min: 5000, max: 10000 },
    { label: '10M - 15M VND', min: 10000, max: 15000 },
    { label: '15M - 20M VND', min: 15000, max: 20000 },
    { label: '20M - 30M VND', min: 20000, max: 30000 },
    { label: '30M+ VND', min: 30000, max: null },
  ];

  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Advance Filter</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {/* Experience */}
          <div>
            <h3 className="font-semibold mb-3">Experience</h3>
            <div className="space-y-2">
              {['Freshers', '1 - 2 Years', '2 - 4 Years', '4 - 6 Years', '6 - 8 Years', '8 - 10 Years', '10 - 15 Years', '15+ Years'].map((exp) => (
                <label key={exp} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="experience"
                    className="mr-2"
                    checked={filters.experience === exp}
                    onChange={() => setFilters({...filters, experience: exp})}
                  />
                  <span className="text-sm">{exp}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Salary */}
          <div>
            <h3 className="font-semibold mb-3">Salary</h3>
            <div className="space-y-2">
              {salaryRanges.map((range) => (
                <label key={range.label} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="salary"
                    className="mr-2"
                    checked={filters.min_salary === range.min && filters.max_salary === range.max}
                    onChange={() => setFilters({
                      ...filters,
                      min_salary: range.min,
                      max_salary: range.max
                    })}
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Job Type */}
          <div>
            <h3 className="font-semibold mb-3">Job Type</h3>
            <div className="space-y-2">
              {['All', 'Full Time', 'Part Time', 'Internship', 'Remote', 'Temporary', 'Contract Base'].map((type) => (
                <label key={type} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={type === 'All' ? !filters.job_type : filters.job_type === type}
                    onChange={(e) => {
                      if (type === 'All') {
                        setFilters({...filters, job_type: ''});
                      } else {
                        setFilters({...filters, job_type: e.target.checked ? type : ''});
                      }
                    }}
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="font-semibold mb-3">Education</h3>
            <div className="space-y-2">
              {['All', 'Currently Studying', 'Bachelor Degree', 'Master Degree', 'PhD Degree'].map((edu) => (
                <label key={edu} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={edu === 'All' ? !filters.education : filters.education === edu}
                    onChange={(e) => {
                      if (edu === 'All') {
                        setFilters({...filters, education: ''});
                      } else {
                        setFilters({...filters, education: e.target.checked ? edu : ''});
                      }
                    }}
                  />
                  <span className="text-sm">{edu}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Job Level */}
          <div>
            <h3 className="font-semibold mb-3">Job Level</h3>
            <div className="space-y-2">
              {['Entry Level', 'Mid Level', 'Expert Level'].map((level) => (
                <label key={level} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="level"
                    className="mr-2"
                    checked={filters.level === level}
                    onChange={() => setFilters({...filters, level: level})}
                  />
                  <span className="text-sm">{level}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              setFilters({
                job_type: '',
                min_salary: '',
                max_salary: '',
                experience: '',
                education: '',
                level: ''
              });
            }}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================
   PAGE
======================= */
export default function JobsListPage() {
  const navigate = useNavigate();

  /* ---------- state ---------- */
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  // filters
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(false);
  const [filters, setFilters] = useState({
    job_type: '',
    min_salary: '',
    max_salary: '',
    experience: '',
    education: '',
    level: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);

  // pagination
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // view mode
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('latest');

  /* ---------- debounce ---------- */
  const debouncedQ = useDebounce(q, 400);

  /* ---------- API call ---------- */
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        q: debouncedQ,
        location,
        page,
        size,
      };

      // Add filters
      if (filters.job_type) params.job_type = filters.job_type;
      if (filters.experience) params.experience_level = filters.experience;
      if (filters.min_salary) params.min_salary = filters.min_salary;
      if (filters.max_salary) params.max_salary = filters.max_salary;

      console.log('Fetching jobs with params:', params);

      const res = await getJobs(params);

      console.log('API Response:', res);

      setJobs(res.items || []);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setError("Không tải được danh sách việc làm, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, location, filters, page, size]);

  // Fetch saved jobs to mark them
  const fetchSavedJobs = useCallback(async () => {
    try {
      const savedRes = await jobService.getSavedJobs(1, 1000);
      const savedIds = new Set(savedRes.data.map(job => job.id));
      setSavedJobIds(savedIds);
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    }
  }, []);

  // Fetch applied job IDs
  const fetchAppliedJobs = useCallback(async () => {
    try {
      const appliedRes = await jobService.getAppliedJobIds();
      const appliedIds = new Set(appliedRes.data || []);
      setAppliedJobIds(appliedIds);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  }, []);

  // Toggle save/unsave job
  const handleToggleSave = async (jobId, e) => {
    e.stopPropagation();
    try {
      if (savedJobIds.has(jobId)) {
        await jobService.unsaveJob(jobId);
        setSavedJobIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        await jobService.saveJob(jobId);
        setSavedJobIds(prev => new Set(prev).add(jobId));
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  /* ---------- effect ---------- */
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchSavedJobs();
    fetchAppliedJobs();
  }, [fetchSavedJobs, fetchAppliedJobs]);

  // Update active filters display
  useEffect(() => {
    const active = [];
    if (category) active.push({ label: category, key: 'category' });
    if (location) active.push({ label: location, key: 'location' });
    if (filters.job_type) active.push({ label: filters.job_type, key: 'job_type' });
    if (filters.min_salary) active.push({ label: `$${filters.min_salary}+`, key: 'salary' });
    setActiveFilters(active);
  }, [category, location, filters]);

  const removeFilter = (key) => {
    if (key === 'category') setCategory('');
    if (key === 'location') setLocation('');
    if (key === 'job_type') setFilters({...filters, job_type: ''});
    if (key === 'salary') setFilters({...filters, min_salary: '', max_salary: ''});
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchJobs();
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Find Job</h1>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 flex gap-3">
              {/* Job Title Search */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Job title, Keyword..."
                  value={q}
                  onChange={(e) => {
                    setPage(1);
                    setQ(e.target.value);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Location */}
              <div className="w-64 relative">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => {
                    setPage(1);
                    setLocation(e.target.value);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category */}
              <div className="w-64">
                <select
                  value={category}
                  onChange={(e) => {
                    setPage(1);
                    setCategory(e.target.value);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="IT">IT & Software</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              {/* Advance Filter Button */}
              <button
                onClick={() => setShowAdvanceFilter(true)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap flex items-center gap-2"
              >
                Advance Filter
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Find Job Button */}
            <button
              onClick={() => {
                setPage(1);
                fetchJobs();
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Find Job
            </button>
          </div>

          {/* Filter Tags */}
          {activeFilters.length > 0 && (
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => removeFilter(filter.key)}
                  className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm flex items-center gap-2 hover:bg-blue-100"
                >
                  {filter.label}
                  <span>×</span>
                </button>
              ))}
              <button
                onClick={() => {
                  setCategory('');
                  setLocation('');
                  setFilters({
                    job_type: '',
                    min_salary: '',
                    max_salary: '',
                    experience: '',
                    education: '',
                    level: ''
                  });
                  setPage(1);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
            </select>
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
              <option value={48}>48 per page</option>
            </select>
            <span className="text-sm text-gray-600">
              Showing {jobs.length} jobs
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 border rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zM11 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM11 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 border rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* STATE */}
        {loading && <p className="text-center py-10">Loading jobs...</p>}
        {error && <p className="text-red-500 text-center py-10">{error}</p>}
        {!loading && !error && jobs.length === 0 && (
          <p className="text-center py-10">No jobs found.</p>
        )}

        {/* JOB LIST */}
        {!loading && jobs.length > 0 && (
          viewMode === 'grid' ? (
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
                      onClick={(e) => handleToggleSave(job.id, e)}
                      className={savedJobIds.has(job.id) ? "text-black" : "text-gray-400 hover:text-gray-600"}
                    >
                      <svg className="w-5 h-5" fill={savedJobIds.has(job.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
                    {appliedJobIds.has(job.id) ? (
                      <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/job/${job.id}`);
                        }}
                        className="text-blue-600 text-sm font-semibold hover:text-blue-700"
                      >
                        Apply Now →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/job/${job.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-pink-100 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-pink-600 text-2xl">📱</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-xl mb-1">{job.title}</h3>
                            {job.company_name && (
                              <p className="text-gray-500">{job.company_name}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-6 text-sm text-gray-600 mb-3">
                          <span>📍 {job.location}</span>
                          <span>💰 {job.salary_min && job.salary_max
                            ? `$${job.salary_min?.toLocaleString()} - $${job.salary_max?.toLocaleString()}`
                            : 'Negotiable'}</span>
                          <span>⏰ {new Date(job.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded-full">Featured</span>
                          <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{job.job_type || 'Full Time'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={(e) => handleToggleSave(job.id, e)}
                        className={savedJobIds.has(job.id) ? "text-black" : "text-gray-400 hover:text-gray-600"}
                      >
                        <svg className="w-6 h-6" fill={savedJobIds.has(job.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                      {appliedJobIds.has(job.id) ? (
                        <span className="px-6 py-2 bg-green-50 text-green-600 rounded font-semibold flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Applied
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/job/${job.id}`);
                          }}
                          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Apply Now →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* PAGINATION */}
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
      </div>

      {/* Advance Filter Modal */}
      <AdvanceFilterModal
        isOpen={showAdvanceFilter}
        onClose={() => setShowAdvanceFilter(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
