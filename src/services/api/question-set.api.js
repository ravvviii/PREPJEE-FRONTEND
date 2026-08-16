import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient, unwrap } from './axios';

export async function getQuestionSets({ subjectId, classId, chapterId, type, examId }) {
  const response = await apiClient.get(API_ENDPOINTS.QUESTION_SETS, {
    params: { subjectId, classId, chapterId, type, examId },
  });
  return unwrap(response);
}

export async function startSetAttempt(setId) {
  const response = await apiClient.post(`${API_ENDPOINTS.QUESTION_SETS}/${setId}/attempts`);
  return unwrap(response);
}

export async function submitSetAttempt(setAttemptId, answers) {
  const response = await apiClient.post(`/set-attempts/${setAttemptId}/submit`, { answers });
  return unwrap(response);
}

export async function getSetAttemptResult(setAttemptId) {
  const response = await apiClient.get(`/set-attempts/${setAttemptId}`);
  return unwrap(response);
}
