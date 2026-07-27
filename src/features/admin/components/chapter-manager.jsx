'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/feedback/confirm-dialog';
import { AdminPageHeader } from './admin-page-header';
import { createAdminResource, deleteAdminResource, listResource, updateAdminResource } from '../services/admin-api';

export function ChapterManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ name: '', subjectId: '', classId: '' });
  const subjects = useQuery({ queryKey: ['admin', 'subjects'], queryFn: () => listResource('subjects', { limit: 100 }) });
  const classes = useQuery({ queryKey: ['admin', 'classes'], queryFn: () => listResource('classes', { limit: 100 }) });
  const chapters = useQuery({ queryKey: ['admin', 'chapters'], queryFn: () => listResource('chapters', { limit: 100 }) });
  const subjectNames = useMemo(() => new Map(subjects.data?.items.map((x) => [x.id, x.name]) ?? []), [subjects.data]);
  const classNames = useMemo(() => new Map(classes.data?.items.map((x) => [x.id, x.name]) ?? []), [classes.data]);
  const save = useMutation({
    mutationFn: () => editing?.id
      ? updateAdminResource('chapters', editing.id, form)
      : createAdminResource('chapters', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'chapters'] });
      setEditing(null);
      toast.success('Chapter saved');
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: () => deleteAdminResource('chapters', deleting.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'chapters'] });
      setDeleting(null);
      toast.success('Chapter removed');
    },
    onError: (e) => toast.error(e.message),
  });
  function open(item = {}) {
    setEditing(item);
    setForm({ name: item.name ?? '', subjectId: item.subjectId ?? '', classId: item.classId ?? '' });
  }
  return (
    <>
      <AdminPageHeader title="Chapters" description="Manage chapters by subject and class."
        action={<Button onClick={() => open()}><Plus /> Add chapter</Button>} />
      <div className="overflow-hidden rounded-2xl border bg-card">
        {(chapters.data?.items ?? []).map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b p-4 last:border-0">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{subjectNames.get(item.subjectId)} · {classNames.get(item.classId)}</p>
            </div>
            <div className="flex">
              <Button variant="ghost" size="icon" onClick={() => open(item)}><Pencil /></Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleting(item)}><Trash2 /></Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={Boolean(editing)} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit' : 'Create'} chapter</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Subject</Label>
              <Select value={form.subjectId} onValueChange={(subjectId) => setForm({ ...form, subjectId })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Subject" /></SelectTrigger>
                <SelectContent>{subjects.data?.items.map((x) => <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Class</Label>
              <Select value={form.classId} onValueChange={(classId) => setForm({ ...form, classId })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Class" /></SelectTrigger>
                <SelectContent>{classes.data?.items.map((x) => <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={() => save.mutate()} disabled={!form.name || !form.subjectId || !form.classId}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={Boolean(deleting)} onOpenChange={(v) => !v && setDeleting(null)}
        title={`Delete ${deleting?.name}?`} destructive onConfirm={() => remove.mutate()} />
    </>
  );
}
