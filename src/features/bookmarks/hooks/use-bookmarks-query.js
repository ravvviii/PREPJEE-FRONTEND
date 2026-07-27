'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { getBookmarks } from '@/services/api/bookmark.api';

export function useBookmarksQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKMARKS,
    queryFn: () => getBookmarks({ limit: 100 }),
    select: (page) => page.items,
  });
}
