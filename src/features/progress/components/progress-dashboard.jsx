'use client';

import { Award, CheckCircle2, Flame, Target, TrendingDown } from 'lucide-react';
import { ErrorState } from '@/components/feedback/error-state';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityHeatmap } from './activity-heatmap';
import { useProgressQuery } from '../hooks/use-progress-query';

function Metric({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <Icon className="size-5 text-primary" />
      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

export function ProgressDashboard() {
  const { data, isLoading, isError, error, refetch } = useProgressQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-52 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }
  if (isError) {
    return <ErrorState title="Couldn't load progress" description={error?.message} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-gradient-to-br from-primary/12 via-card to-card p-6 sm:p-8">
        <p className="text-sm font-medium text-primary">Your learning journey</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Progress dashboard</h1>
        <div className="mt-6 max-w-xl space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall completion</span>
            <span className="font-semibold">{data.progressPercent}%</span>
          </div>
          <Progress value={data.progressPercent} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          icon={CheckCircle2}
          label="Questions solved"
          value={data.solvedQuestionsCount}
          detail={`${data.attemptedQuestionsCount} unique questions attempted`}
        />
        <Metric icon={Target} label="Accuracy" value={`${data.overallAccuracy}%`} detail="Across all attempts" />
        <Metric icon={Flame} label="Daily streak" value={`${data.dailyStreak} days`} detail="Keep showing up" />
        <Metric
          icon={Award}
          label="Chapters complete"
          value={data.completedChapters.length}
          detail="Every published question attempted"
        />
      </section>

      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="font-semibold">Study activity</h2>
          <p className="text-sm text-muted-foreground">Your attempts over the last 90 days</p>
        </div>
        <ActivityHeatmap activity={data.dailyActivity} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="font-semibold">Accuracy by difficulty</h2>
          <div className="mt-5 space-y-5">
            {data.difficultyPerformance.length === 0 ? (
              <p className="text-sm text-muted-foreground">Attempt questions to unlock this chart.</p>
            ) : (
              data.difficultyPerformance.map((item) => (
                <div key={item.difficulty} className="space-y-2">
                  <div className="flex justify-between text-sm capitalize">
                    <span>{item.difficulty}</span>
                    <span>{item.accuracyPercent}%</span>
                  </div>
                  <Progress value={item.accuracyPercent} />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <TrendingDown className="size-5 text-warning" />
            <h2 className="font-semibold">Weak chapters</h2>
          </div>
          <div className="mt-5 space-y-3">
            {data.weakChapters.length === 0 ? (
              <p className="text-sm text-muted-foreground">No weak chapters identified yet.</p>
            ) : (
              data.weakChapters.map((chapter) => (
                <div key={chapter.id} className="rounded-xl border p-4">
                  <div className="flex justify-between gap-3">
                    <p className="font-medium">{chapter.name}</p>
                    <span className="text-sm font-semibold text-warning">{chapter.accuracyPercent}%</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {chapter.correctAttempts} correct from {chapter.totalAttempts} attempts
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
