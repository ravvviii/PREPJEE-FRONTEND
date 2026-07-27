import { apiClient, unwrap } from '@/services/api/axios';

export async function getSubscriptionPlans() {
  const response = await apiClient.get('/subscription-plans', { params: { limit: 100 } });
  return unwrap(response);
}

const CHECKOUT_KEY_PREFIX = 'prepjee_checkout_';

function checkoutStorageKey(planId) {
  return `${CHECKOUT_KEY_PREFIX}${planId}`;
}

export function getCheckoutIdempotencyKey(planId) {
  const storageKey = checkoutStorageKey(planId);
  const existing = sessionStorage.getItem(storageKey);
  if (existing) return existing;

  const key = crypto.randomUUID();
  sessionStorage.setItem(storageKey, key);
  return key;
}

export function clearCheckoutIdempotencyKey(planId) {
  sessionStorage.removeItem(checkoutStorageKey(planId));
}

export async function createPaymentOrder(planId) {
  const response = await apiClient.post('/payments/order', {
    planId,
    idempotencyKey: getCheckoutIdempotencyKey(planId),
  });
  return unwrap(response);
}

export async function verifyPayment(fields) {
  const response = await apiClient.post('/payments/verify', fields);
  return unwrap(response);
}
