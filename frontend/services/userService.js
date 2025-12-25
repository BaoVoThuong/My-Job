import api from './api';

const userService = {
  // Get current user profile (GET /api/users/me)
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update user profile (PUT /api/users/me)
  updateProfile: async (profileData) => {
    const response = await api.put('/users/me', profileData);
    return response.data;
  },

  // Get user's applied jobs (GET /api/users/me/applications)
  getAppliedJobs: async () => {
    const response = await api.get('/users/me/applications');
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
