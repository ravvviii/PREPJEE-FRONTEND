'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/feedback/confirm-dialog';
import { AdminPageHeader } from './admin-page-header';
import {
  createAdminResource, deleteAdminResource, listAdminResource, listResource,
  setQuestionPublished, updateAdminResource,
} from '../services/admin-api';

const EMPTY = { subjectId: '', classId: '', chapterId: '', difficulty: 'medium', questionText: '' };

export function QuestionManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const questions = useQuery({
    queryKey: ['admin', 'questions'],
    queryFn: () => listAdminResource('questions', { limit: 100 }),
  });
  const subjects = useQuery({ queryKey: ['admin', 'subjects'], queryFn: () => listResource('subjects', { limit: 100 }) });
  const classes = useQuery({ queryKey: ['admin', 'classes'], queryFn: () => listResource('classes', { limit: 100 }) });
  const chapters = useQuery({ queryKey: ['admin', 'chapters'], queryFn: () => listResource('chapters', { limit: 100 }) });
  const save = useMutation({
    mutationFn: () => editing?.id
      ? updateAdminResource('questions', editing.id, form)
      : createAdminResource('questions', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'questions'] }); setEditing(null); toast.success('Question saved'); },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: () => deleteAdminResource('questions', deleting.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'questions'] }); setDeleting(null); toast.success('Question removed'); },
    onError: (e) => toast.error(e.message),
  });
  const visibility = useMutation({
    mutationFn: ({ id, published }) => setQuestionPublished(id, published),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'questions'] }),
    onError: (e) => toast.error(e.message),
  });
  function open(item = {}) {
    setEditing(item);
    setForm({
      subjectId: item.subjectId ?? '',
      classId: item.classId ?? '',
      chapterId: item.chapterId ?? '',
      difficulty: item.difficulty ?? 'medium',
      questionText: item.questionText ?? '',
    });
  }
  const matchingChapters = chapters.data?.items.filter(
    (x) => (!form.subjectId || x.subjectId === form.subjectId) && (!form.classId || x.classId === form.classId),
  ) ?? [];
  return (
    <>
      <AdminPageHeader title="Questions" description="Create drafts, edit content, and control publication."
        action={<Button onClick={() => open()}><Plus /> Add question</Button>} />
      <div className="space-y-3">
        {(questions.data?.data.items ?? []).map((item) => (
          <div key={item.id} className="rounded-2xl border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-2 flex gap-2">
                  <Badge variant={item.isPublished ? 'default' : 'secondary'}>{item.isPublished ? 'Published' : 'Draft'}</Badge>
                  <Badge variant="outline" className="capitalize">{item.difficulty}</Badge>
                </div>
                <p className="line-clamp-2 text-sm">{item.questionText}</p>
              </div>
              <div className="flex shrink-0">
                <Button variant="ghost" size="icon" onClick={() => visibility.mutate({ id: item.id, published: !item.isPublished })}>
                  {item.isPublished ? <EyeOff /> : <Eye />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => open(item)}><Pencil /></Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleting(item)}><Trash2 /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={Boolean(editing)} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit' : 'Create'} question</DialogTitle></DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Subject</Label><Select value={form.subjectId} onValueChange={(subjectId) => setForm({ ...form, subjectId, chapterId: '' })}>
              <SelectTrigger className="mt-2 w-full"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>{subjects.data?.items.map((x) => <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)}</SelectContent>
            </Select></div>
            <div><Label>Class</Label><Select value={form.classId} onValueChange={(classId) => setForm({ ...form, classId, chapterId: '' })}>
              <SelectTrigger className="mt-2 w-full"><SelectValue placeholder="Class" /></SelectTrigger>
              <SelectContent>{classes.data?.items.map((x) => <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)}</SelectContent>
            </Select></div>
            <div><Label>Chapter</Label><Select value={form.chapterId} onValueChange={(chapterId) => setForm({ ...form, chapterId })}>
              <SelectTrigger className="mt-2 w-full"><SelectValue placeholder="Chapter" /></SelectTrigger>
              <SelectContent>{matchingChapters.map((x) => <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)}</SelectContent>
            </Select></div>
            <div><Label>Difficulty</Label><Select value={form.difficulty} onValueChange={(difficulty) => setForm({ ...form, difficulty })}>
              <SelectTrigger className="mt-2 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{['easy', 'medium', 'hard'].map((x) => <SelectItem key={x} value={x} className="capitalize">{x}</SelectItem>)}</SelectContent>
            </Select></div>
            <div className="sm:col-span-2"><Label>Question text</Label><Textarea className="mt-2 min-h-32" value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} /></div>
          </div>
          <DialogFooter><Button onClick={() => save.mutate()} disabled={!form.subjectId || !form.classId || !form.chapterId || !form.questionText.trim()}>Save draft</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={Boolean(deleting)} onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete this question?" destructive onConfirm={() => remove.mutate()} />
    </>
  );
}
