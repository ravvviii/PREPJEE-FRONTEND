'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { getChapters } from '@/services/api/chapter.api';

export function useChaptersQuery({ subjectId, classId, search }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CHAPTERS, subjectId, classId, search],
    queryFn: async () => {
      const page = await getChapters({ subjectId, classId, search, limit: 100 });
      return page.items;
    },
    enabled: Boolean(subjectId && classId),
  });
}
