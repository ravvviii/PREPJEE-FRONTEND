import { apiClient, unwrap } from './axios';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export async function getMe() {
  const response = await apiClient.get(API_ENDPOINTS.USERS.ME);
  return unwrap(response);
}

export async function updateProfile(fields) {
  const response = await apiClient.put(API_ENDPOINTS.USERS.PROFILE, fields);
  return unwrap(response);
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/users/avatar', formData);
  return unwrap(response);
}
