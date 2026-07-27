'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { getClasses } from '@/services/api/class.api';

export function useClassesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.CLASSES,
    queryFn: () => getClasses({ limit: 100 }),
    select: (page) => page.items,
  });
}
