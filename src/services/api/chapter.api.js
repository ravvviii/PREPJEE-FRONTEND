import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from './axios';

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

  // Keep this resource tolerant of both the standard backend envelope and an
  // already-unwrapped response (for example after a dev-server hot reload).
  const rawPayload = response?.data ?? response;
  let payload = rawPayload;

  // Some local dev responses can be JSON-encoded more than once after an
  // Axios retry/HMR cycle. Unwrap a small, bounded number of layers.
  for (let depth = 0; depth < 3 && typeof payload === 'string'; depth += 1) {
    try {
      payload = JSON.parse(payload);
    } catch {
      throw new Error('The chapter API returned malformed JSON.');
    }
  }

  const unwrapped = payload?.data ?? payload;
  const page = Array.isArray(unwrapped) ? { items: unwrapped, nextCursor: null } : unwrapped;

  if (!page || !Array.isArray(page.items)) {
    const receivedType =
      unwrapped === null ? 'null' : Array.isArray(unwrapped) ? 'array' : typeof unwrapped;
    throw new Error(`The chapter API returned an unexpected ${receivedType} response.`);
  }
  return page;
}
