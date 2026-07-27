'use client';

import { useEffect } from 'react';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';

export function LoginPageAnalytics() {
  useEffect(() => {
    track(ANALYTICS_EVENTS.LOGIN_PAGE_VIEWED);
  }, []);
  return null;
}
