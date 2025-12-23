import api from './api';

const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Get user's applied jobs
  getAppliedJobs: async () => {
    const response = await api.get('/users/applied-jobs');
    return response.data;
  },

  // Get user's saved jobs
  getSavedJobs: async () => {
    const response = await api.get('/users/saved-jobs');
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  },
};

export default userService;
