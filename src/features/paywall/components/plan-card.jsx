'use client';

import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatPrice(amount, currency) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(amount / 100);
}

export function PlanCard({ plan, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(plan.id)}
      aria-pressed={selected}
      className={cn(
        'relative w-full rounded-2xl border p-4 text-left transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        selected
          ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
          : 'hover:border-primary/50 hover:bg-muted/40',
      )}
    >
      {plan.isDefault && (
        <span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
          <Sparkles className="size-3" aria-hidden="true" />
          Recommended
        </span>
      )}
      <span className="flex items-center justify-between gap-4">
        <span>
          <span className="block font-semibold">{plan.name}</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            {plan.durationDays} days of Premium access
          </span>
        </span>
        <span className="flex items-center gap-3">
          <span className="text-xl font-bold">{formatPrice(plan.amount, plan.currency)}</span>
          <span
            className={cn(
              'flex size-5 items-center justify-center rounded-full border',
              selected && 'border-primary bg-primary text-primary-foreground',
            )}
            aria-hidden="true"
          >
            {selected && <Check className="size-3.5" />}
          </span>
        </span>
      </span>
    </button>
  );
}
