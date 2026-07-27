import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient, unwrap } from './axios';

export async function getProgress() {
  const response = await apiClient.get(API_ENDPOINTS.PROGRESS);
  return unwrap(response);
}
