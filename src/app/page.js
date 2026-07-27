'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { LoadingOverlay } from '@/components/feedback/loading-overlay';

export default function RootPage() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN);
  }, [isLoading, isAuthenticated, router]);

  return <LoadingOverlay fullScreen label="Loading PrepJEE…" />;
}
