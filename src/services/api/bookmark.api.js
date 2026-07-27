import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient, unwrap } from './axios';

export async function getBookmarks({ limit = 100 } = {}) {
  const response = await apiClient.get(API_ENDPOINTS.BOOKMARKS, { params: { limit } });
  return unwrap(response);
}

export async function addBookmark(questionId) {
  const response = await apiClient.post(`/questions/${questionId}/bookmark`);
  return unwrap(response);
}

export async function removeBookmark(questionId) {
  const response = await apiClient.delete(`/questions/${questionId}/bookmark`);
  return unwrap(response);
}
