'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';
import { getQuestionAccuracy, submitAttempt } from '@/services/api/attempt.api';

export function useQuestionAttempt(questionId, { onSuccess } = {}) {
  const queryClient = useQueryClient();
  const accuracyQuery = useQuery({
    queryKey: [...QUERY_KEYS.QUESTION_ACCURACY, questionId],
    queryFn: () => getQuestionAccuracy(questionId),
    enabled: Boolean(questionId),
  });

  const mutation = useMutation({
    mutationFn: (payload) => submitAttempt(questionId, payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.QUESTION_ACCURACY, questionId],
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAPTERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAPTER_OVERVIEW });
      onSuccess?.(result);
    },
    onError: (error) => toast.error(error.message ?? 'Could not submit your answer'),
  });

  return {
    submit: mutation.mutate,
    isSubmitting: mutation.isPending,
    accuracy: accuracyQuery.data,
  };
}
