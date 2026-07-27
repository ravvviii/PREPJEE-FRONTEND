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
  recurringEnabled: false,
  billingPeriod: 'monthly',
  billingInterval: 1,
  totalCount: 12,
  trialAmount: '',
  trialDays: '',
  providerPlanId: '',
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
        amount: Math.round(Number(form.amount) * 100),
        durationDays: Number(form.durationDays),
        bucketMin: Number(form.bucketMin),
        bucketMax: Number(form.bucketMax),
        recurringEnabled: Boolean(form.recurringEnabled),
      };
      if (form.recurringEnabled) {
        fields.billingInterval = Number(form.billingInterval);
        fields.totalCount = Number(form.totalCount);
        fields.trialAmount = form.trialAmount === '' ? undefined : Math.round(Number(form.trialAmount) * 100);
        fields.trialDays = form.trialDays === '' ? undefined : Number(form.trialDays);
      } else {
        delete fields.billingPeriod;
        delete fields.billingInterval;
        delete fields.totalCount;
        delete fields.trialAmount;
        delete fields.trialDays;
        delete fields.providerPlanId;
      }
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
    setForm(
      plan.id
        ? {
            ...plan,
            amount: plan.amount / 100,
            trialAmount: plan.trialAmount ? plan.trialAmount / 100 : '',
            trialDays: plan.trialDays ?? '',
            billingPeriod: plan.billingPeriod ?? 'monthly',
            billingInterval: plan.billingInterval ?? 1,
            totalCount: plan.totalCount ?? 12,
            providerPlanId: plan.providerPlanId ?? '',
          }
        : EMPTY,
    );
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
            {plan.recurringEnabled && (
              <Badge className="mt-4 ml-2">
                {plan.trialAmount ? `₹${plan.trialAmount / 100} trial · ` : ''}
                every {plan.billingInterval} {plan.billingPeriod}
              </Badge>
            )}
          </div>
        ))}
      </div>
      <Dialog open={Boolean(editing)} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit' : 'Create'} plan</DialogTitle></DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Amount (₹)</Label><Input type="number" min="1" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
            <div className="space-y-2"><Label>Duration days</Label><Input type="number" min="1" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Bucket minimum</Label>
              <Input type="number" min="0" max="99" value={form.bucketMin} onChange={(e) => setForm({ ...form, bucketMin: e.target.value })} />
            </div>
            <Label className="flex items-center justify-between rounded-xl border p-3 sm:col-span-2">
              Recurring subscription
              <Checkbox checked={form.recurringEnabled} onCheckedChange={(recurringEnabled) => setForm({ ...form, recurringEnabled: Boolean(recurringEnabled) })} />
            </Label>
            {form.recurringEnabled && <>
              <div className="space-y-2">
                <Label>Billing period</Label>
                <select className="h-9 w-full rounded-md border bg-transparent px-3 text-sm" value={form.billingPeriod} onChange={(e) => setForm({ ...form, billingPeriod: e.target.value })}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="space-y-2"><Label>Billing interval</Label><Input type="number" min="1" value={form.billingInterval} onChange={(e) => setForm({ ...form, billingInterval: e.target.value })} /></div>
              <div className="space-y-2"><Label>Total renewal cycles</Label><Input type="number" min="1" value={form.totalCount} onChange={(e) => setForm({ ...form, totalCount: e.target.value })} /></div>
              <div className="space-y-2"><Label>Razorpay Plan ID</Label><Input placeholder="plan_..." value={form.providerPlanId} onChange={(e) => setForm({ ...form, providerPlanId: e.target.value })} /></div>
              <div className="space-y-2"><Label>Trial amount (₹)</Label><Input type="number" min="1" step="0.01" placeholder="1" value={form.trialAmount} onChange={(e) => setForm({ ...form, trialAmount: e.target.value })} /></div>
              <div className="space-y-2"><Label>Trial days</Label><Input type="number" min="1" placeholder="1" value={form.trialDays} onChange={(e) => setForm({ ...form, trialDays: e.target.value })} /></div>
            </>}
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
                Number(form.amount) < 1 ||
                Number(form.bucketMin) < 0 ||
                Number(form.bucketMax) > 99 ||
                Number(form.bucketMin) > Number(form.bucketMax) ||
                (form.recurringEnabled &&
                  (!form.providerPlanId ||
                    Number(form.billingInterval) < 1 ||
                    Number(form.totalCount) < 1 ||
                    ((form.trialAmount !== '' || form.trialDays !== '') &&
                      (Number(form.trialAmount) < 1 || Number(form.trialDays) < 1))))
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
