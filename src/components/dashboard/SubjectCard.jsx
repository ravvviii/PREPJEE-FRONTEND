'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUBJECT_COLORS } from '@/components/dashboard/subject-colors';
import { ChapterPreviewList } from '@/components/dashboard/ChapterPreviewList';

export function SubjectCard({
  name,
  color,
  totalChapters,
  totalQuestions,
  chaptersCovered,
  previewChapters,
  index = 0,
}) {
  const colors = SUBJECT_COLORS[color];
  const percentage =
    totalChapters > 0 ? Math.round((chaptersCovered / totalChapters) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.01 }}
      className="flex flex-col rounded-3xl border border-border p-6 transition-colors duration-200 hover:border-foreground/20"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalChapters} CHAPTERS · {totalQuestions.toLocaleString()} Q
          </p>
        </div>

        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
            colors.badgeBg,
            colors.badgeText
          )}
        >
          {name.charAt(0)}
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', colors.bar)}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs font-semibold tracking-widest text-muted-foreground">
        <span>{percentage}% COVERED</span>
        <span>
          {chaptersCovered} / {totalChapters}
        </span>
      </div>

      <div className="mt-5 border-t border-border pt-1">
        <ChapterPreviewList chapters={previewChapters} />
      </div>

      <a
        href="#"
        className={cn(
          'mt-4 flex items-center gap-1.5 text-sm font-medium',
          colors.link
        )}
      >
        All {totalChapters} chapters <ArrowRight className="h-4 w-4" />
      </a>
    </motion.div>
  );
}
