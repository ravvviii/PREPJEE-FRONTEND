'use client';

import { useQuery } from '@tanstack/react-query';
import { CircleHelp, CreditCard, IndianRupee, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { AdminPageHeader } from './admin-page-header';
import { getDashboardData } from '../services/admin-api';

const metrics = [
  ['totalUsers', 'Total users', Users],
  ['totalPublishedQuestions', 'Published questions', CircleHelp],
  ['activeSubscriptions', 'Active subscriptions', CreditCard],
];

export function AdminDashboard() {
  const query = useQuery({ queryKey: ['admin', 'dashboard'], queryFn: getDashboardData });
  if (query.isLoading) return <Skeleton className="h-96 rounded-2xl" />;
  if (query.isError)
    return <ErrorState title="Could not load admin dashboard" description={query.error.message} onRetry={query.refetch} />;

  const { stats, questions, chapters } = query.data;
  return (
    <>
      <AdminPageHeader title="Dashboard" description="A live overview of PrepJEE operations." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([key, label, Icon]) => (
          <div key={key} className="rounded-2xl border bg-card p-5">
            <Icon className="size-5 text-primary" />
            <p className="mt-4 text-2xl font-bold">{stats[key]}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
        <div className="rounded-2xl border bg-card p-5">
          <IndianRupee className="size-5 text-primary" />
          <p className="mt-4 text-2xl font-bold">₹{(stats.totalRevenue.amount / 100).toLocaleString('en-IN')}</p>
          <p className="text-sm text-muted-foreground">Paid revenue</p>
        </div>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="font-semibold">Most attempted questions</h2>
          <div className="mt-4 space-y-3">
            {questions.length ? questions.map((item) => (
              <div key={item.questionId} className="flex gap-3 rounded-xl border p-3">
                <span className="font-semibold text-primary">{item.attemptCount}</span>
                <p className="line-clamp-2 text-sm">{item.questionText}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">No attempt data yet.</p>}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="font-semibold">Weak chapters</h2>
          <div className="mt-4 space-y-3">
            {chapters.length ? chapters.map((item) => (
              <div key={item.chapterId} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="text-sm font-medium">{item.chapterName}</p>
                  <p className="text-xs text-muted-foreground">{item.attemptCount} attempts</p>
                </div>
                <span className="font-semibold text-warning">{Math.round(item.accuracy * 100)}%</span>
              </div>
            )) : <p className="text-sm text-muted-foreground">No chapter accuracy data yet.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
