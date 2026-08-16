'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookOpenCheck,
  CheckCircle2,
  CircleHelp,
  Dumbbell,
  History,
  Target,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { useChapterOverviewQuery } from '../hooks/use-chapter-overview-query';
import { getChapterDescription } from '../utils/chapter-description';
import { getChapterDifficulty } from '../utils/chapter';
import { SetList } from '@/features/question-sets/components/set-list';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-72 rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <Icon className="size-5 text-primary" aria-hidden="true" />
      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
    </div>
  );
}

export function ChapterOverview({ chapterId, subjectId, classId, subjectName, className, chapterName }) {
  const { data, isLoading, isError, error, refetch } = useChapterOverviewQuery({
    chapterId,
    subjectId,
    classId,
  });

  useEffect(() => {
    track(ANALYTICS_EVENTS.CHAPTER_OVERVIEW_VIEWED, {
      chapterId,
      chapterName,
      subjectId,
      classId,
    });
  }, [chapterId, chapterName, classId, subjectId]);

  const chaptersHref = `/subjects/${subjectId}/classes/${classId}/chapters?subject=${encodeURIComponent(subjectName)}&class=${encodeURIComponent(className)}`;

  if (isLoading) return <OverviewSkeleton />;
  if (isError) {
    return (
      <ErrorState
        title="Couldn't load chapter overview"
        description={error?.message ?? 'Check your connection and try again.'}
        onRetry={refetch}
      />
    );
  }

  const { chapter, questions, accuracy, bookmarkCount, pyqCount } = data;
  const difficulty = getChapterDifficulty(chapter);
  const progress = chapter.progressPercent ?? 0;
  const completed = questions.length > 0 && progress === 100;

  const practiceHref = `/subjects/${subjectId}/classes/${classId}/chapters/${chapterId}/practice?subject=${encodeURIComponent(subjectName)}&class=${encodeURIComponent(className)}&chapter=${encodeURIComponent(chapter.name)}`;

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href={chaptersHref}>
          <ArrowLeft aria-hidden="true" />
          Back to chapters
        </Link>
      </Button>

      <section className="rounded-2xl border bg-gradient-to-br from-primary/12 via-card to-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{subjectName}</Badge>
              <Badge variant="outline">{className}</Badge>
              {difficulty && <Badge className="capitalize">{difficulty}</Badge>}
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{chapter.name}</h1>
            <p className="mt-3 leading-7 text-muted-foreground">
              {getChapterDescription(chapter.name, subjectName)}
            </p>
          </div>
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <BookOpenCheck className="size-7" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-7 max-w-xl space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{completed ? 'Chapter completed' : 'Chapter progress'}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Chapter statistics">
        <StatCard icon={CircleHelp} label="Questions" value={questions.length} detail="Published practice set" />
        <StatCard icon={History} label="PYQs" value={pyqCount} detail="Previous-year questions" />
        <StatCard
          icon={Target}
          label="Accuracy"
          value={`${accuracy.accuracyPercent}%`}
          detail={`${accuracy.correctAttempts} of ${accuracy.totalAttempts} attempts correct`}
        />
        <StatCard icon={Bookmark} label="Bookmarks" value={bookmarkCount} detail="Saved from this chapter" />
      </section>

      <SetList
        subjectId={subjectId}
        classId={classId}
        chapterId={chapterId}
        subjectName={subjectName}
        className={className}
        chapterName={chapter.name}
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <Dumbbell className="size-6 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold">Practice</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Work through the complete chapter question set with instant solutions and progress tracking.
          </p>
          <Button className="mt-5" asChild>
            <Link href={practiceHref}>Start practice</Link>
          </Button>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <History className="size-6 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold">Previous-year questions</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Focus on the {pyqCount} available JEE PYQs connected to this chapter.
          </p>
          <Button variant="outline" className="mt-5" asChild>
            <Link href={`${practiceHref}&mode=pyq`}>Explore PYQs</Link>
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6">
        <div className="flex items-start gap-4">
          {completed ? (
            <Trophy className="mt-0.5 size-7 text-warning" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="mt-0.5 size-7 text-success" aria-hidden="true" />
          )}
          <div>
            <h2 className="font-semibold">{completed ? 'Chapter complete!' : 'Completion goal'}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {completed
                ? 'You have attempted every published question in this chapter.'
                : `${chapter.attemptedQuestionCount ?? 0} of ${questions.length} published questions attempted.`}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
