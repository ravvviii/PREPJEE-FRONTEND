'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { getSubjectDisplay } from '../constants/subject-display';

export function SubjectCard({ subject, classItem, onSelect }) {
  const { icon: Icon, accent } = getSubjectDisplay(subject.name);
  const href = `/subjects/${subject.id}/classes/${classItem.id}/chapters?subject=${encodeURIComponent(subject.name)}&class=${encodeURIComponent(classItem.name)}`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18 }}
    >
      <Link
        href={href}
        onClick={() => onSelect(subject, classItem)}
        className="group block w-full rounded-2xl border bg-card p-5 text-left shadow-sm transition-[border-color,box-shadow] hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label={`Open ${subject.name} · ${classItem.name}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent}`}>
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <Badge variant="secondary" className="bg-red-500 text-white">{classItem.name}</Badge>
        </div>
        <h2 className="mt-5 text-lg font-semibold">{subject.name}</h2>
        <p className="mt-2 text-sm leading-5 text-muted-foreground">
          Chapters and practice questions for {classItem.name}.
        </p>
        <span className="mt-6 flex items-center gap-1.5 text-sm font-medium text-primary">
          View chapters
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </motion.div>
  );
}
