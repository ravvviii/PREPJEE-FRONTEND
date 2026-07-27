'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, ShieldCheck, ShieldX } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminPageHeader } from './admin-page-header';
import { listAdminResource, setUserSuspended } from '../services/admin-api';
import { useDebounce } from '@/hooks/use-debounce';

export function UserManager() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search.trim(), 350);
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'users', debounced],
    queryFn: () => listAdminResource('users', { limit: 100, ...(debounced ? { search: debounced } : {}) }),
  });
  const status = useMutation({
    mutationFn: ({ id, suspended }) => setUserSuspended(id, suspended),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User status updated');
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <>
      <AdminPageHeader title="Users" description="Search accounts and manage access." />
      <div className="relative mb-5 max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" placeholder="Search name, email, or phone..." />
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card">
        {(query.data?.data ?? []).map((user) => (
          <div key={user.id} className="flex flex-col gap-3 border-b p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{user.name ?? 'Unnamed user'}</p>
                <Badge variant={user.suspendedAt ? 'destructive' : 'secondary'}>{user.suspendedAt ? 'Suspended' : 'Active'}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{user.email ?? user.phone ?? 'No contact details'}</p>
            </div>
            <Button
              variant={user.suspendedAt ? 'outline' : 'destructive'}
              onClick={() => status.mutate({ id: user.id, suspended: !user.suspendedAt })}
            >
              {user.suspendedAt ? <ShieldCheck /> : <ShieldX />}
              {user.suspendedAt ? 'Unsuspend' : 'Suspend'}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
