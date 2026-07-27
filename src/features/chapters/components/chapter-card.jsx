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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18 }}
    >
      <Link
        href={href}
        onClick={() => onSelect(chapter)}
        className="group block w-full rounded-2xl border bg-card p-5 text-left shadow-sm transition-[border-color,box-shadow] hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpenCheck className="size-5" aria-hidden="true" />
        </div>
        <Badge className={cn('capitalize', difficulty ? DIFFICULTY_STYLES[difficulty] : '')} variant="secondary">
          {difficulty ?? 'Not rated'}
        </Badge>
        </div>

      <h2 className="mt-4 line-clamp-2 min-h-12 font-semibold leading-6">{chapter.name}</h2>
      <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <CircleHelp className="size-4" aria-hidden="true" />
        {questionCount} {questionCount === 1 ? 'question' : 'questions'}
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Your progress</span>
          <span className="font-medium">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} aria-label={`${chapter.name} progress: ${progressPercent}%`} />
      </div>

      <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
        Start practice
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
      </Link>
    </motion.div>
  );
}
