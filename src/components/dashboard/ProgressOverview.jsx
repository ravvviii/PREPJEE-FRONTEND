'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { SubjectCoverage } from '@/components/dashboard/SubjectCoverage';
import { WeeklyActivity } from '@/components/dashboard/WeeklyActivity';
import { progress as defaultProgress } from '@/components/dashboard/progress-data';

export function ProgressOverview({ progress = defaultProgress }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      <SectionHeader locked={progress.locked} />

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
