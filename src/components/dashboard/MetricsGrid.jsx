'use client';

import { MetricCard } from '@/components/dashboard/MetricCard';

export function MetricsGrid({ progress }) {
  const metrics = [
    {
      title: 'Questions Solved',
      value: progress.questionsSolved,
    },
    {
      title: 'Accuracy',
      value: progress.accuracy != null ? `${progress.accuracy}%` : '—',
    },
    {
      title: 'Chapters Covered',
      value: progress.chaptersCovered,
      subtitle: `/ ${progress.totalChapters}`,
    },
    {
      title: 'Mocks Attempted',
      value: progress.mocksAttempted,
      subtitle: `/ ${progress.totalMocks}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-border sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.title} index={index} locked={progress.locked} {...metric} />
      ))}
    </div>
  );
}
