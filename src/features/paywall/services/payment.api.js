import { apiClient, unwrap } from '@/services/api/axios';

export async function getSubscriptionPlans() {
  const response = await apiClient.get('/subscription-plans', { params: { limit: 100 } });
  return unwrap(response);
}

export async function createPaymentOrder(planId) {
  const response = await apiClient.post('/payments/order', { planId });
  return unwrap(response);
}

export async function verifyPayment(fields) {
  const response = await apiClient.post('/payments/verify', fields);
  return unwrap(response);
}
