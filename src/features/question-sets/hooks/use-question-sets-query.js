'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { getQuestionSets } from '@/services/api/question-set.api';

export function useQuestionSetsQuery({ subjectId, classId, chapterId, type, examId }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.QUESTION_SETS, { subjectId, classId, chapterId, type, examId }],
    queryFn: () => getQuestionSets({ subjectId, classId, chapterId, type, examId }),
    enabled: Boolean(subjectId && classId && chapterId),
  });
}
