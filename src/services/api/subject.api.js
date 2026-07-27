import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient, unwrap } from './axios';

export async function getSubjects({ cursor, limit = 12 } = {}) {
  const response = await apiClient.get(API_ENDPOINTS.SUBJECTS, {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
    },
  });

  return unwrap(response);
}
