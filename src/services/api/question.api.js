import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient, unwrap } from './axios';

export async function getQuestions({ chapterId, limit = 100 }) {
  const response = await apiClient.get(API_ENDPOINTS.QUESTIONS, {
    params: { chapterId, limit },
  });
  return unwrap(response);
}
