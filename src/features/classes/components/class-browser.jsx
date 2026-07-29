'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { ClassGrid } from './class-grid';
import { ClassSkeleton } from './class-skeleton';
import { useClassesQuery } from '../hooks/use-classes-query';
import { sortClasses } from '../utils/class-order';
import { ROUTES } from '@/constants/routes';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';

export function ClassBrowser({ subjectId, subjectName }) {
  const router = useRouter();
  const { data: rawClasses = [], isLoading, isError, error, refetch } = useClassesQuery();
  const classes = useMemo(() => sortClasses(rawClasses), [rawClasses]);

  function handleSelect(classItem) {
    track(ANALYTICS_EVENTS.CLASS_SELECTED, {
      classId: classItem.id,
      className: classItem.name,
      subjectId,
      subjectName,
    });
    router.push(
      `/subjects/${subjectId}/classes/${classItem.id}/chapters?subject=${encodeURIComponent(subjectName)}&class=${encodeURIComponent(classItem.name)}`,
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href={ROUTES.SUBJECTS}>
          <ArrowLeft aria-hidden="true" />
          Back to subjects
        </Link>
      </Button>

      {/* <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/12 via-card to-card p-6 sm:p-8">
        <div className="flex max-w-2xl flex-col gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden="true" />
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <BookOpen className="size-4" aria-hidden="true" />
              {subjectName || 'Selected subject'}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Choose your class</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              Select your current class to see the most relevant chapters and practice material.
            </p>
          </div>
        </div>
      </div> */}

      <div>
        <h2 className="text-lg font-semibold">Available classes</h2>
        <p className="text-sm text-muted-foreground">
          Classes shown for your {subjectName || 'subject'} learning path.
        </p>
      </div>

      {isLoading ? (
        <ClassSkeleton />
      ) : isError ? (
        <ErrorState
          title="Couldn't load classes"
          description={error?.message ?? 'Check your connection and try again.'}
          onRetry={refetch}
        />
      ) : classes.length === 0 ? (
        <EmptyState title="No classes available" description="Classes will appear here once they are available." />
      ) : (
        <ClassGrid classes={classes} selectedClassId={null} onSelect={handleSelect} />
      )}
    </div>
  );
}
