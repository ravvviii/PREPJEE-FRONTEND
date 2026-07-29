'use client';

import { useEffect } from 'react';

// Browsers don't let JS delete arbitrary entries from session history, so the
// only way to stop the back button from unwinding through everywhere the user
// clicked to get here is to keep re-pushing this URL on every `popstate` —
// pressing back on this page just re-lands on it instead of surfacing the
// stack of screens visited before it.
export function useTrapBackNavigation(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [enabled]);
}
