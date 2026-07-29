'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { SubjectCard } from '@/components/dashboard/SubjectCard';
import { subjectsOverview as defaultSubjectsOverview } from '@/components/dashboard/progress-data';
import { usePaywall } from '@/features/paywall/providers/paywall-provider';
import { FEATURES } from '@/features/paywall/config/entitlement-policy';
import { useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query';

export function SubjectsOverview({ data = defaultSubjectsOverview }) {
  const { triggerPaywall } = usePaywall();
  const subjectsQuery = useSubjectsQuery();

  // Dashboard progress is mocked by subject name (Physics/Chemistry/Mathematics),
  // but the classes route needs the real backend subject ID — match them up here.
  const subjectsByName = useMemo(() => {
    const items = subjectsQuery.data?.pages.flatMap((page) => page.items) ?? [];
    return new Map(items.map((subject) => [subject.name.toLowerCase(), subject]));
  }, [subjectsQuery.data]);

  const handleClick = (event) => {
    if (!data.locked) return;
    event.preventDefault();
    triggerPaywall({
      feature: FEATURES.PREMIUM_ACCESS,
      source: 'subjects_overview_section',
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
      className={cn('flex flex-col gap-6', data.locked && 'cursor-pointer')}
    >
      <SectionHeader
        label="SUBJECTS"
        heading="Pick a subject"
        actionLabel="All subjects"
        locked={data.locked}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {data.subjects.map((subject, index) => {
          const realSubject = subjectsByName.get(subject.name.toLowerCase());
          const href =
            !data.locked && realSubject
              ? `/subjects/${realSubject.id}/classes?subject=${encodeURIComponent(realSubject.name)}`
              : undefined;

          return <SubjectCard key={subject.id} index={index} href={href} {...subject} />;
        })}
      </div>
    </motion.section>
  );
}
