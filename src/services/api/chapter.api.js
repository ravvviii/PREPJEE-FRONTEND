import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient, unwrap } from './axios';

export async function getChapters({ subjectId, classId, search, cursor, limit = 100 }) {
  const response = await apiClient.get(API_ENDPOINTS.CHAPTERS, {
    params: {
      subjectId,
      classId,
      limit,
      ...(search ? { search } : {}),
      ...(cursor ? { cursor } : {}),
    },
  });

  const page = unwrap(response);
  if (!page || !Array.isArray(page.items)) {
    throw new Error('The chapter API returned an invalid response. Please restart the backend and try again.');
  }
  return page;
}
