'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { ConfirmDialog } from '@/components/feedback/confirm-dialog';
import { AdminPageHeader } from './admin-page-header';
import { createAdminResource, deleteAdminResource, listResource, updateAdminResource } from '../services/admin-api';

export function ReferenceManager({ resource, title, description }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [name, setName] = useState('');
  const key = ['admin', resource];
  const query = useQuery({
    queryKey: key,
    queryFn: () => listResource(resource, { limit: 100 }),
  });
  const save = useMutation({
    mutationFn: () =>
      editing?.id
        ? updateAdminResource(resource, editing.id, { name: name.trim() })
        : createAdminResource(resource, { name: name.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      setEditing(null);
      setName('');
      toast.success(`${title.slice(0, -1)} saved`);
    },
    onError: (error) => toast.error(error.message),
  });
  const remove = useMutation({
    mutationFn: () => deleteAdminResource(resource, deleting.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      setDeleting(null);
      toast.success('Item removed');
    },
    onError: (error) => toast.error(error.message),
  });

  function openEditor(item = {}) {
    setEditing(item);
    setName(item.name ?? '');
  }

  return (
    <>
      <AdminPageHeader
        title={title}
        description={description}
        action={<Button onClick={() => openEditor()}><Plus /> Add {title.slice(0, -1).toLowerCase()}</Button>}
      />
      {query.isLoading ? <Skeleton className="h-72 rounded-2xl" /> : query.isError ? (
        <ErrorState description={query.error.message} onRetry={query.refetch} />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card">
          {query.data.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 border-b p-4 last:border-0">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.id}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEditor(item)}><Pencil /></Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleting(item)}><Trash2 /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Edit' : 'Create'} {title.slice(0, -1).toLowerCase()}</DialogTitle>
            <DialogDescription>Changes are reflected immediately in the student application.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="resource-name">Name</Label>
            <Input id="resource-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={() => save.mutate()} disabled={!name.trim() || save.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${deleting?.name}?`}
        description="This soft-deletes the item and hides it from student lists."
        destructive
        confirmLabel="Delete"
        onConfirm={() => remove.mutate()}
      />
    </>
  );
}
