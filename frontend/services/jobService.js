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

  // Search jobs with filters (compatible with JobsListPage)
  searchJobs: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.q) params.append('q', filters.q);
    if (filters.skill) params.append('skill', filters.skill);
    if (filters.location) params.append('location', filters.location);
    if (filters.job_type) params.append('job_type', filters.job_type);
    if (filters.level) params.append('level', filters.level);
    if (filters.employmentType) params.append('job_type', filters.employmentType);
    if (filters.min_salary) params.append('min_salary', filters.min_salary);
    if (filters.max_salary) params.append('max_salary', filters.max_salary);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.size) params.append('limit', filters.size);

    const response = await api.get(`/jobs/search?${params.toString()}`);
    return response.data;
  },

  // Apply for a job
  applyJob: async (jobId, profileId = null) => {
    const response = await api.post(`/jobs/${jobId}/apply`, {
      profile_id: profileId
    });
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

  // Get saved jobs
  getSavedJobs: async (page = 1, limit = 10) => {
    const response = await api.get(`/jobs/saved?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get applied job IDs
  getAppliedJobIds: async () => {
    const response = await api.get('/jobs/applied-ids');
    return response.data;
  }
};

// Export named functions for compatibility with hoangvuong's code
export async function getJobs(params = {}) {
  console.log('getJobs called with params:', params);

  try {
    let response;

    // If có filters thì dùng searchJobs, không thì dùng getAllJobs
    const hasFilters = params.q || params.location || params.job_type || params.experience_level || params.min_salary || params.max_salary || params.skill;

    if (hasFilters) {
      console.log('Using searchJobs API with filters');
      response = await jobService.searchJobs(params);
      console.log('searchJobs response:', response);

      // searchJobs returns { meta, data }
      return {
        items: response.data || [],
        meta: {
          page: response.meta?.page || params.page || 1,
          size: response.meta?.limit || params.size || 10,
          totalItems: response.meta?.count || 0,
          totalPages: Math.ceil((response.meta?.count || 0) / (response.meta?.limit || params.size || 10)),
        },
      };
    } else {
      console.log('Using getAllJobs API');
      response = await jobService.getAllJobs();
      console.log('getAllJobs response:', response);

      // getAllJobs returns { success, count, data, pagination }
      return {
        items: response.data || [],
        meta: {
          page: params.page || 1,
          size: params.size || 10,
          totalItems: response.count || response.data?.length || 0,
          totalPages: response.pagination?.totalPages || Math.ceil((response.count || response.data?.length || 0) / (params.size || 10)),
        },
      };
    }
  } catch (error) {
    console.error('getJobs error:', error);
    throw error;
  }
}

export async function getJobDetail(jobId) {
  const response = await jobService.getJobById(jobId);
  return {
    success: true,
    data: response.data,
    message: null,
  };
}

export default jobService;
