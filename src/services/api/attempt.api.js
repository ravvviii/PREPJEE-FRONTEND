import { apiClient, unwrap } from './axios';

export async function getChapterAccuracy(chapterId) {
  const response = await apiClient.get(`/chapters/${chapterId}/accuracy`);
  return unwrap(response);
}
