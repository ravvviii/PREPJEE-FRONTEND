'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { getExams } from '@/services/api/exam.api';

export function useExamsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.EXAMS,
    queryFn: getExams,
    staleTime: 60 * 60 * 1000,
  });
}
