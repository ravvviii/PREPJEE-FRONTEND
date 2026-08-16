'use client';

import Link from 'next/link';
import { ArrowRight, BookOpenCheck, CircleHelp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { DIFFICULTY_STYLES, getChapterDifficulty } from '../utils/chapter';

export function ChapterCard({ chapter, href, onSelect }) {
  const difficulty = getChapterDifficulty(chapter);
  const questionCount = chapter.questionCount ?? 0;
  const progressPercent = chapter.progressPercent ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.18 }}
    >
      <Link
        href={href}
        onClick={() => onSelect(chapter)}
        className="group flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left shadow-sm transition-[border-color,box-shadow] hover:border-primary/35 hover:shadow-md hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpenCheck className="size-5" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold leading-6">{chapter.name}</h2>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <CircleHelp className="size-3.5 shrink-0" aria-hidden="true" />
            {questionCount} {questionCount === 1 ? 'question' : 'questions'}
          </div>
        </div>

        <Badge
          className={cn('hidden shrink-0 capitalize sm:inline-flex', difficulty ? DIFFICULTY_STYLES[difficulty] : '')}
          variant="secondary"
        >
          {difficulty ?? 'Not rated'}
        </Badge>

        <div className="hidden w-32 shrink-0 space-y-1.5 sm:block">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-medium text-foreground">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} aria-label={`${chapter.name} progress: ${progressPercent}%`} />
        </div>

        <ArrowRight
          className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  );
}
