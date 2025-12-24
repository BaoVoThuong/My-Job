import api from './api';

const jobService = {
  // Get all jobs
  getAllJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },

  // Get job by ID
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

<<<<<<< HEAD
  // Search jobs with filters (compatible with JobsListPage)
=======
  // Search jobs with filters
>>>>>>> d8f4b6dd27e42e2420908d9b3678d12ab3e9cb81
  searchJobs: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.q) params.append('q', filters.q);
    if (filters.skill) params.append('skill', filters.skill);
    if (filters.location) params.append('location', filters.location);
    if (filters.job_type) params.append('job_type', filters.job_type);
<<<<<<< HEAD
    if (filters.level) params.append('level', filters.level);
    if (filters.employmentType) params.append('job_type', filters.employmentType);
=======
>>>>>>> d8f4b6dd27e42e2420908d9b3678d12ab3e9cb81
    if (filters.min_salary) params.append('min_salary', filters.min_salary);
    if (filters.max_salary) params.append('max_salary', filters.max_salary);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
<<<<<<< HEAD
    if (filters.size) params.append('limit', filters.size);
=======
>>>>>>> d8f4b6dd27e42e2420908d9b3678d12ab3e9cb81

    const response = await api.get(`/jobs/search?${params.toString()}`);
    return response.data;
  },

  // Apply for a job
  applyJob: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/apply`);
    return response.data;
  },

  // Save job to favorites
  saveJob: async (jobId) => {
    const response = await api.post(`/jobs/saved/${jobId}`);
    return response.data;
  },

  // Remove job from favorites
  unsaveJob: async (jobId) => {
    const response = await api.delete(`/jobs/saved/${jobId}`);
    return response.data;
  },
};

<<<<<<< HEAD
// Export named functions for compatibility with hoangvuong's code
export async function getJobs(params = {}) {
  const response = await jobService.searchJobs(params);

  // Transform API response to match expected format
  return {
    items: response.data || [],
    meta: response.meta || {
      page: params.page || 1,
      size: params.size || 10,
      totalItems: response.count || 0,
      totalPages: Math.ceil((response.count || 0) / (params.size || 10)),
    },
  };
}

export async function getJobDetail(jobId) {
  const response = await jobService.getJobById(jobId);
  return {
    success: true,
    data: response.data,
    message: null,
  };
}

=======
>>>>>>> d8f4b6dd27e42e2420908d9b3678d12ab3e9cb81
export default jobService;
