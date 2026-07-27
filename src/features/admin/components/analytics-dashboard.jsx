'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminPageHeader } from './admin-page-header';
import { getDashboardData } from '../services/admin-api';

export function AnalyticsDashboard() {
  const query = useQuery({ queryKey: ['admin', 'analytics'], queryFn: getDashboardData });
  if (query.isLoading) return <Skeleton className="h-96 rounded-2xl" />;
  const { stats, questions, chapters } = query.data;
  const maxAttempts = Math.max(1, ...questions.map((x) => x.attemptCount));
  return (
    <>
      <AdminPageHeader title="Analytics" description="Question engagement and learning-quality signals." />
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-2"><BarChart3 className="size-5 text-primary" /><h2 className="font-semibold">Question engagement</h2></div>
          <div className="mt-5 space-y-5">
            {questions.map((item) => (
              <div key={item.questionId}>
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span className="line-clamp-1">{item.questionText}</span><span>{item.attemptCount}</span>
                </div>
                <Progress value={(item.attemptCount / maxAttempts) * 100} />
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-2"><TrendingDown className="size-5 text-warning" /><h2 className="font-semibold">Chapter accuracy</h2></div>
          <div className="mt-5 space-y-5">
            {chapters.map((item) => (
              <div key={item.chapterId}>
                <div className="mb-2 flex justify-between text-sm"><span>{item.chapterName}</span><span>{Math.round(item.accuracy * 100)}%</span></div>
                <Progress value={item.accuracy * 100} />
              </div>
            ))}
          </div>
        </section>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Tracking {stats.totalUsers} users, {stats.totalPublishedQuestions} published questions, and {stats.totalAttempts} attempts.
      </p>
    </>
  );
}
