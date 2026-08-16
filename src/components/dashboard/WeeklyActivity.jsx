'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function WeeklyActivity({ days }) {
  const activeCount = days.filter(Boolean).length;

  return (
    <div className="flex h-full flex-col rounded-3xl border border-border p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">This week</h3>
        <span className="text-xs font-semibold tracking-widest text-muted-foreground">
          {activeCount} / {days.length} ACTIVE
        </span>
      </div>

      <div className="mt-6 grid flex-1 grid-cols-7 gap-2">
        {days.map((active, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className={cn(
              'flex flex-col items-center justify-end gap-2 rounded-xl border border-dashed p-2 pb-3',
              active ? 'border-foreground/30 bg-muted/40' : 'border-border'
            )}
          >
            <span
              className={cn(
                'h-6 w-full rounded-full',
                active ? 'bg-foreground/70' : 'bg-muted'
              )}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">
        {DAY_LABELS.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>

      <p className="mt-6 border-t border-dashed border-border pt-4 text-xs text-muted-foreground">
        A day counts at 25 solved questions. Today is still open.
      </p>
    </div>
  );
}
