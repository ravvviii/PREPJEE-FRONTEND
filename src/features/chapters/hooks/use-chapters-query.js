'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { getChapters } from '@/services/api/chapter.api';

export function useChaptersQuery({ subjectId, classId, search }) {
  return useQuery({
    // v2 separates this normalized result from chapter queries cached by the
    // earlier response-transform implementation during local hot reloads.
    queryKey: [...QUERY_KEYS.CHAPTERS, 'v3', subjectId, classId, search],
    queryFn: async () => {
      const page = await getChapters({ subjectId, classId, search, limit: 100 });
      return page.items;
    },
    enabled: Boolean(subjectId && classId),
  });
}
