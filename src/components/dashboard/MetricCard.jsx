'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function MetricCard({ title, value, subtitle, locked, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'flex flex-col gap-2 border-border p-6 transition-colors duration-200 hover:border-foreground/20',
        'border-b sm:border-b-0 sm:border-r last:border-none sm:last:border-none'
      )}
    >
      <p className="text-xs font-semibold tracking-widest text-muted-foreground">
        {title.toUpperCase()}
      </p>

      <div className="flex items-baseline gap-1">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: index * 0.08 + 0.1 }}
          className={cn(
            'text-4xl font-bold leading-none',
            locked ? 'text-muted-foreground' : 'text-foreground'
          )}
        >
          {value}
        </motion.span>

        {subtitle && (
          <span className="text-lg font-medium text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
    </motion.div>
  );
}
