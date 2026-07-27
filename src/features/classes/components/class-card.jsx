'use client';

import { Check, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ClassCard({ classItem, isActive, onSelect }) {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(classItem)}
      aria-pressed={isActive}
      className={cn(
        'group relative w-full overflow-hidden rounded-2xl border bg-card p-6 text-left shadow-sm transition-[border-color,box-shadow,background-color] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        isActive
          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
          : 'hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5',
      )}
    >
      <div
        className={cn(
          'flex size-12 items-center justify-center rounded-xl transition-colors',
          isActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary',
        )}
      >
        <GraduationCap className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-lg font-semibold">{classItem.name}</h2>
      <p className="mt-2 text-sm leading-5 text-muted-foreground">
        Explore chapters and questions curated for {classItem.name}.
      </p>

      <motion.div
        initial={false}
        animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        className="absolute top-5 right-5 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
        aria-hidden="true"
      >
        <Check className="size-4" />
      </motion.div>
    </motion.button>
  );
}
