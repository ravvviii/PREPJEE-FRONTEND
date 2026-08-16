'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, ListChecks, Timer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useExamsQuery } from '../hooks/use-exams-query';
import { useQuestionSetsQuery } from '../hooks/use-question-sets-query';

function formatDuration(seconds) {
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

function SetRow({ set, href }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant={set.type === 'mock' ? 'default' : 'secondary'} className="capitalize">
            {set.type}
          </Badge>
          <h3 className="font-semibold">{set.name}</h3>
        </div>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ListChecks className="size-4" aria-hidden="true" />
            {set.questionCount} questions
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {formatDuration(set.durationSeconds)}
          </span>
        </div>
      </div>
      <Button asChild className="shrink-0">
        <Link href={href}>
          <Timer className="size-4" aria-hidden="true" />
          Start
        </Link>
      </Button>
    </div>
  );
}

export function SetList({ subjectId, classId, chapterId, subjectName, className, chapterName }) {
  const [selectedExamId, setSelectedExamId] = useState('all');
  const examsQuery = useExamsQuery();
  const setsQuery = useQuestionSetsQuery({ subjectId, classId, chapterId });

  if (setsQuery.isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-64 rounded-full" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    );
  }

  const sets = setsQuery.data ?? [];
  if (sets.length === 0) return null;

  const exams = examsQuery.data ?? [];
  const visibleSets = sets.filter(
    (set) => selectedExamId === 'all' || set.examId === selectedExamId,
  );
  const practiceSets = visibleSets.filter((set) => set.type === 'practice');
  const mockSets = visibleSets.filter((set) => set.type === 'mock');

  const buildHref = (setId) =>
    `/subjects/${subjectId}/classes/${classId}/chapters/${chapterId}/sets/${setId}?subject=${encodeURIComponent(subjectName)}&class=${encodeURIComponent(className)}&chapter=${encodeURIComponent(chapterName)}`;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Timed practice &amp; mock exams</h2>
        <p className="text-sm text-muted-foreground">Sets are curated and timed — score is saved to your progress.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedExamId('all')}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
            selectedExamId === 'all' ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted',
          )}
        >
          All
        </button>
        {exams.map((exam) => (
          <button
            key={exam.id}
            type="button"
            onClick={() => setSelectedExamId(exam.id)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              selectedExamId === exam.id ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted',
            )}
          >
            {exam.name}
          </button>
        ))}
      </div>

      {practiceSets.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">PRACTICE SETS</p>
          {practiceSets.map((set) => (
            <SetRow key={set.id} set={set} href={buildHref(set.id)} />
          ))}
        </div>
      )}

      {mockSets.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">MOCK EXAMS</p>
          {mockSets.map((set) => (
            <SetRow key={set.id} set={set} href={buildHref(set.id)} />
          ))}
        </div>
      )}
    </section>
  );
}
