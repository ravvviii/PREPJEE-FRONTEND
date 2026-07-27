import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient, unwrap } from './axios';

export async function getClasses({ cursor, limit = 100 } = {}) {
  const response = await apiClient.get(API_ENDPOINTS.CLASSES, {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
    },
  });

  return unwrap(response);
}
