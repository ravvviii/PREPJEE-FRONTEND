import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient, unwrap } from './axios';

export async function getBookmarks({ limit = 100 } = {}) {
  const response = await apiClient.get(API_ENDPOINTS.BOOKMARKS, { params: { limit } });
  return unwrap(response);
}
