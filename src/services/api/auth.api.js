import { apiClient, unwrap } from './axios';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export async function sendOtp(phone) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.SEND_OTP, { phone });
  return unwrap(response);
}

export async function verifyOtp(phone, otp) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { phone, otp });
  return unwrap(response);
}

export async function loginWithGoogle(idToken) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.GOOGLE, { idToken });
  return unwrap(response);
}

export async function refreshSession(refreshToken) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  return unwrap(response);
}

export async function logout(refreshToken) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  return unwrap(response);
}
