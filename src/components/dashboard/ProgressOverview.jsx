'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { SubjectCoverage } from '@/components/dashboard/SubjectCoverage';
import { WeeklyActivity } from '@/components/dashboard/WeeklyActivity';
import { progress as defaultProgress } from '@/components/dashboard/progress-data';
import { usePaywall } from '@/features/paywall/providers/paywall-provider';
import { FEATURES } from '@/features/paywall/config/entitlement-policy';

export function ProgressOverview({ progress = defaultProgress }) {
  const { triggerPaywall } = usePaywall();

  const handleClick = (event) => {
    if (!progress.locked) return;
    event.preventDefault();
    triggerPaywall({
      feature: FEATURES.PREMIUM_ACCESS,
      source: 'progress_overview_section',
      title: 'Unlock Student Pass',
      description:
        'Get unlimited JEE practice, PYQs, detailed solutions and advanced analytics.',
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleClick}
      className={cn('flex flex-col gap-6', progress.locked && 'cursor-pointer')}
    >
      <SectionHeader
        label="OVERALL PROGRESS"
        heading="Where you stand"
        actionLabel="Full analytics"
        locked={progress.locked}
      />

      <MetricsGrid progress={progress} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SubjectCoverage
          subjects={progress.subjects}
          chaptersCovered={progress.chaptersCovered}
          totalChapters={progress.totalChapters}
        />
        <WeeklyActivity days={progress.weeklyActivity} />
      </div>
    </motion.section>
  );
}
