'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentPassBadge } from '@/components/dashboard/StudentPassBadge';

export function SectionHeader({
  label = 'OVERALL PROGRESS',
  heading = 'Where you stand',
  actionLabel = 'Full analytics',
  locked,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold tracking-widest text-muted-foreground">
          {label}
        </p>

        <div className="mt-1 flex items-center gap-3">
          <h2 className="text-3xl font-bold leading-tight">{heading}</h2>
          {locked && <StudentPassBadge />}
        </div>
      </div>

      <Button variant="ghost" className="self-start sm:self-auto">
        {actionLabel} <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
