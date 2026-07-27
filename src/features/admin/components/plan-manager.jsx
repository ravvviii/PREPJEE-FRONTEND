'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminPageHeader } from './admin-page-header';
import { createAdminResource, listAdminResource, updateAdminResource } from '../services/admin-api';

const EMPTY = {
  name: '',
  amount: 100,
  currency: 'INR',
  durationDays: 30,
  bucketMin: 0,
  bucketMax: 99,
  isActive: true,
  isDefault: false,
};

export function PlanManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const query = useQuery({
    queryKey: ['admin', 'subscription-plans'],
    queryFn: () => listAdminResource('subscription-plans', { limit: 100 }),
  });
  const save = useMutation({
    mutationFn: () => {
      const fields = {
        ...form,
        amount: Number(form.amount),
        durationDays: Number(form.durationDays),
        bucketMin: Number(form.bucketMin),
        bucketMax: Number(form.bucketMax),
      };
      if (!editing?.id) {
        delete fields.isActive;
        delete fields.isDefault;
        return createAdminResource('subscription-plans', fields);
      }
      return updateAdminResource('subscription-plans', editing.id, fields);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'subscription-plans'] });
      setEditing(null);
      toast.success('Plan saved');
    },
    onError: (e) => toast.error(e.message),
  });
  function open(plan = {}) {
    setEditing(plan);
    setForm(plan.id ? { ...plan } : EMPTY);
  }
  return (
    <>
      <AdminPageHeader title="Subscription Plans" description="Configure pricing, duration, availability, and defaults."
        action={<Button onClick={() => open()}><Plus /> Add plan</Button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(query.data?.data.items ?? []).map((plan) => (
          <div key={plan.id} className="rounded-2xl border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                <Badge variant={plan.isActive ? 'secondary' : 'outline'}>{plan.isActive ? 'Active' : 'Retired'}</Badge>
                {plan.isDefault && <Badge><Star className="size-3 fill-current" /> Default</Badge>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => open(plan)}><Pencil /></Button>
            </div>
            <h2 className="mt-5 text-lg font-semibold">{plan.name}</h2>
            <p className="mt-2 text-3xl font-bold">₹{(plan.amount / 100).toLocaleString('en-IN')}</p>
            <p className="text-sm text-muted-foreground">{plan.durationDays} days</p>
            <Badge variant="outline" className="mt-4">
              Buckets {plan.bucketMin}–{plan.bucketMax}
            </Badge>
          </div>
        ))}
      </div>
      <Dialog open={Boolean(editing)} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit' : 'Create'} plan</DialogTitle></DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Amount (paise)</Label><Input type="number" min="100" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
            <div className="space-y-2"><Label>Duration days</Label><Input type="number" min="1" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Bucket minimum</Label>
              <Input type="number" min="0" max="99" value={form.bucketMin} onChange={(e) => setForm({ ...form, bucketMin: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Bucket maximum</Label>
              <Input type="number" min="0" max="99" value={form.bucketMax} onChange={(e) => setForm({ ...form, bucketMax: e.target.value })} />
            </div>
            {editing?.id && <>
              <Label className="flex items-center justify-between rounded-xl border p-3">Active <Checkbox checked={form.isActive} onCheckedChange={(isActive) => setForm({ ...form, isActive: Boolean(isActive) })} /></Label>
              <Label className="flex items-center justify-between rounded-xl border p-3">Default <Checkbox checked={form.isDefault} onCheckedChange={(isDefault) => setForm({ ...form, isDefault: Boolean(isDefault) })} /></Label>
            </>}
          </div>
          <DialogFooter>
            <Button
              onClick={() => save.mutate()}
              disabled={
                !form.name ||
                Number(form.amount) < 100 ||
                Number(form.bucketMin) < 0 ||
                Number(form.bucketMax) > 99 ||
                Number(form.bucketMin) > Number(form.bucketMax)
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
