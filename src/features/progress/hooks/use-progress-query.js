'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { getProgress } from '@/services/api/progress.api';

export function useProgressQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.PROGRESS,
    queryFn: getProgress,
  });
}
