import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient, unwrap } from './axios';

export async function getQuestions({ chapterId, cursor, limit = 100 }) {
  const response = await apiClient.get(API_ENDPOINTS.QUESTIONS, {
    params: { chapterId, limit, ...(cursor ? { cursor } : {}) },
  });
  return unwrap(response);
}

export async function getQuestion(questionId) {
  const response = await apiClient.get(`${API_ENDPOINTS.QUESTIONS}/${questionId}`);
  return unwrap(response);
}
