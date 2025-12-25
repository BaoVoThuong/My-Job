import api from './api';

/**
 * Employer Service
 * Handles all employer-related API calls for job management
 */

// Get all jobs posted by the current employer
export const getEmployerJobs = async () => {
  try {
    const response = await api.get('/employer/jobs');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a specific job by ID (for editing)
export const getEmployerJobById = async (jobId) => {
  try {
    const response = await api.get(`/employer/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create a new job
export const createJob = async (jobData) => {
  try {
    const response = await api.post('/employer/jobs', jobData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update an existing job
export const updateJob = async (jobId, jobData) => {
  try {
    const response = await api.put(`/employer/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete a job
export const deleteJob = async (jobId) => {
  try {
    const response = await api.delete(`/employer/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get applications for a specific job
export const getJobApplications = async (jobId) => {
  try {
    const response = await api.get(`/employer/jobs/${jobId}/applications`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const employerService = {
  getEmployerJobs,
  getEmployerJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobApplications,
};

export default employerService;
