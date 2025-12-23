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

  // Search jobs with filters
  searchJobs: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.q) params.append('q', filters.q);
    if (filters.skill) params.append('skill', filters.skill);
    if (filters.location) params.append('location', filters.location);
    if (filters.job_type) params.append('job_type', filters.job_type);
    if (filters.min_salary) params.append('min_salary', filters.min_salary);
    if (filters.max_salary) params.append('max_salary', filters.max_salary);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

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

export default jobService;
