'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { SubjectCard } from '@/components/dashboard/SubjectCard';
import { subjectsOverview as defaultSubjectsOverview } from '@/components/dashboard/progress-data';

export function SubjectsOverview({ data = defaultSubjectsOverview }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      <SectionHeader
        label="SUBJECTS"
        heading="Pick a subject"
        actionLabel="All subjects"
        locked={data.locked}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {data.subjects.map((subject, index) => (
          <SubjectCard key={subject.id} index={index} {...subject} />
        ))}
      </div>
    </motion.section>
  );
}
