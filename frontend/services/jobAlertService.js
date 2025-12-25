import api from './api';

const jobAlertService = {
  // BE-JA-4: Get all job alerts
  getJobAlerts: async (page = 1, size = 10, onlyUnread = false) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (onlyUnread) {
      params.append('onlyUnread', 'true');
    }

    const response = await api.get(`/candidate/job-alerts?${params.toString()}`);
    return response.data;
  },

  // BE-JA-5: Mark single alert as read
  markAsRead: async (alertId) => {
    const response = await api.post(`/candidate/job-alerts/${alertId}/read`);
    return response.data;
  },

  // BE-JA-5: Mark multiple alerts as read
  markMultipleAsRead: async (alertIds) => {
    const response = await api.post('/candidate/job-alerts/read-all', {
      alertIds
    });
    return response.data;
  },

  // BE-JA-6: Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/candidate/job-alerts/unread-count');
    return response.data;
  }
};

export default jobAlertService;
