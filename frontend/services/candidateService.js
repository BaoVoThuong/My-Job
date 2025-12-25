import api from './api';

/**
 * Candidate Service
 * Handles all employer-side candidate and application management
 */

// Get all applications for a specific job
export const getJobApplications = async (jobId) => {
  try {
    // Use the new endpoint format
    const response = await api.get(`/employer/applications/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get application details
export const getApplicationDetail = async (applicationId) => {
  try {
    const response = await api.get(`/employer/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update application status (APPROVED, DECLINED, INTERVIEW)
export const updateApplicationStatus = async (jobId, applicationId, status) => {
  try {
    const response = await api.put(`/employer/jobs/${jobId}/applications/status`, {
      applicationId,
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Schedule interview for a candidate
export const scheduleInterview = async (applicationId, interviewData) => {
  try {
    const response = await api.post(
      `/employer/applications/${applicationId}/interview`,
      interviewData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Save a candidate for future opportunities
export const saveCandidate = async (candidateId, jobId) => {
  try {
    const response = await api.post('/employer/candidates/save', {
      candidateId,
      jobId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Unsave a candidate
export const unsaveCandidate = async (candidateId) => {
  try {
    const response = await api.delete(`/employer/candidates/saved/${candidateId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all saved candidates
export const getSavedCandidates = async () => {
  try {
    const response = await api.get('/employer/candidates/saved');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Download candidate CV
export const downloadCV = async (cvUrl) => {
  try {
    const response = await api.get(cvUrl, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const candidateService = {
  getJobApplications,
  getApplicationDetail,
  updateApplicationStatus,
  scheduleInterview,
  saveCandidate,
  unsaveCandidate,
  getSavedCandidates,
  downloadCV,
};

export default candidateService;
