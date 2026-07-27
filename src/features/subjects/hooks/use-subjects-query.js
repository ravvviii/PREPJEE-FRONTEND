'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { getSubjects } from '@/services/api/subject.api';

const PAGE_SIZE = 12;

export function useSubjectsQuery() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.SUBJECTS,
    queryFn: ({ pageParam }) => getSubjects({ cursor: pageParam, limit: PAGE_SIZE }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
