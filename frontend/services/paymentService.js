import api from './api';

// Get subscription plans for a specific role
export const getSubscriptionPlans = async (role = 'employer') => {
  try {
    const response = await api.get(`/subscriptions/plans?role=${role}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get current user's subscription and quota
export const getMySubscription = async () => {
  try {
    const response = await api.get('/subscriptions/my-subscription');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get payment history
export const getPaymentHistory = async () => {
  try {
    const response = await api.get('/subscriptions/payment-history');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create MoMo payment
export const createMoMoPayment = async (planId) => {
  try {
    const response = await api.post('/payments/momo/create', {
      plan_id: planId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const paymentService = {
  getSubscriptionPlans,
  getMySubscription,
  getPaymentHistory,
  createMoMoPayment,
};

export default paymentService;
