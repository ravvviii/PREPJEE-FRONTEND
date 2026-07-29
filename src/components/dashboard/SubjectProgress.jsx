'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const DOT_COLORS = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  orange: 'bg-orange-500',
};

const BAR_COLORS = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  orange: 'bg-orange-500',
};

export function SubjectProgress({ subject, color, completed, total }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-4">
      <div className="flex w-28 shrink-0 items-center gap-2">
        <span className={cn('h-2 w-2 rounded-full', DOT_COLORS[color])} />
        <span className="text-sm font-medium">{subject}</span>
      </div>

      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', BAR_COLORS[color])}
        />
      </div>

      <span className="w-14 shrink-0 text-right text-sm text-muted-foreground">
        {completed} / {total}
      </span>
    </div>
  );
}
