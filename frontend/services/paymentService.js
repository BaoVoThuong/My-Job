import api from './api';

const paymentService = {
  // Create MoMo payment
  createMoMoPayment: async (paymentData) => {
    const response = await api.post('/payments/momo/create', paymentData);
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (orderId) => {
    const response = await api.get(`/payments/status/${orderId}`);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },
};

export default paymentService;
