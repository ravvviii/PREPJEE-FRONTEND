import { apiClient, unwrap } from './axios';

export async function getChapterAccuracy(chapterId) {
  const response = await apiClient.get(`/chapters/${chapterId}/accuracy`);
  return unwrap(response);
}

export async function submitAttempt(questionId, { selectedOptionId, timeTakenSeconds }) {
  const response = await apiClient.post(`/questions/${questionId}/attempts`, {
    selectedOptionId,
    timeTakenSeconds,
  });
  return unwrap(response);
}

export async function getQuestionAccuracy(questionId) {
  const response = await apiClient.get(`/questions/${questionId}/accuracy`);
  return unwrap(response);
}
