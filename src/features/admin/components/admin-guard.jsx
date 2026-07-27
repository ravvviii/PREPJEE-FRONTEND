'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAuth } from '../context/admin-auth-context';

export function AdminGuard({ children }) {
  const { admin, ready } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !admin) router.replace('/admin/login');
  }, [admin, ready, router]);

  if (!ready || !admin) return <Skeleton className="m-8 h-96 rounded-2xl" />;
  return children;
}
