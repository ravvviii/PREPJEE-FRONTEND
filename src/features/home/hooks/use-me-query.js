'use client';

import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/services/api/user.api';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useAuth } from '@/context/AuthContext';

export function useMeQuery() {
  const { user, isAuthenticated } = useAuth();
  return useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: getMe,
    enabled: isAuthenticated,
    initialData: user ?? undefined,
  });
}
