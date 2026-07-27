'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { LoadingOverlay } from '@/components/feedback/loading-overlay';

// Real auth enforcement lives here, client-side — proxy.js (src/proxy.js)
// can't see our session (tokens live in memory + localStorage, not a
// cookie), so it only does optimistic pass-through. This is the actual gate.
export function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <LoadingOverlay fullScreen label="Checking your session…" />;
  }

  return children;
}

// For guest-only routes (e.g. Login) — bounce an already-authenticated user
// straight to the dashboard instead of showing them the login form again.
export function RequireGuest({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(ROUTES.HOME);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return <LoadingOverlay fullScreen label="Loading…" />;
  }

  return children;
}
