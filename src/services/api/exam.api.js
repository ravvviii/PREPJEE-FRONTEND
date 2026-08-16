import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient, unwrap } from './axios';

export async function getExams() {
  const response = await apiClient.get(API_ENDPOINTS.EXAMS);
  return unwrap(response);
}
