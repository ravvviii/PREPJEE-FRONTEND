'use client';

import { useMeQuery } from '@/features/home/hooks/use-me-query';
import { hasActiveSubscription } from '@/features/paywall/config/entitlement-policy';

export function useIsPremium() {
  const { data: user, isLoading } = useMeQuery();

  return {
    isPremium: hasActiveSubscription(user),
    isLoading,
    subscription: user?.subscription ?? null,
  };
}
