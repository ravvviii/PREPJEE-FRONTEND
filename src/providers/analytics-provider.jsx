'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';

// useSearchParams requires a Suspense boundary — isolated here so it doesn't
// force the rest of the tree (children) to de-opt from static rendering.
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.toString();
    track(ANALYTICS_EVENTS.PAGE_VIEW, { path: query ? `${pathname}?${query}` : pathname });
  }, [pathname, searchParams]);

  return null;
}

// Fires the app-lifecycle events the spec requires "automatically" —
// individual features only need to track their own domain events on top.
export function AnalyticsProvider({ children }) {
  const appOpenTracked = useRef(false);

  useEffect(() => {
    if (appOpenTracked.current) return;
    appOpenTracked.current = true;
    track(ANALYTICS_EVENTS.APP_OPEN);
    track(ANALYTICS_EVENTS.SESSION_STARTED);

    const handleUnload = () => track(ANALYTICS_EVENTS.SESSION_ENDED);
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  useEffect(() => {
    const reportError = (error, source) => {
      track(ANALYTICS_EVENTS.UNHANDLED_ERROR, {
        source,
        name: error?.name || 'Error',
        message: String(error?.message || error || 'Unknown error').slice(0, 300),
        path: window.location.pathname,
      });
    };

    const handleError = (event) => reportError(event.error || event.message, 'window');
    const handleRejection = (event) => reportError(event.reason, 'promise');

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </>
  );
}
