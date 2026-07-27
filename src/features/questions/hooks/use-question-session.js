'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { getQuestion, getQuestions } from '@/services/api/question.api';

export function useQuestionList({ chapterId }) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.QUESTION_SESSION, chapterId],
    queryFn: ({ pageParam }) => getQuestions({ chapterId, cursor: pageParam, limit: 100 }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(chapterId),
  });
}

export function useQuestionDetail(questionId) {
  return useQuery({
    queryKey: [...QUERY_KEYS.QUESTION_DETAIL, questionId],
    queryFn: () => getQuestion(questionId),
    enabled: Boolean(questionId),
  });
}
