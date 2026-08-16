'use client';

import { SubjectProgress } from '@/components/dashboard/SubjectProgress';

export function SubjectCoverage({ subjects, chaptersCovered, totalChapters }) {
  const percentage =
    totalChapters > 0 ? Math.round((chaptersCovered / totalChapters) * 100) : 0;

  return (
    <div className="flex h-full flex-col rounded-3xl border border-border p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Syllabus coverage</h3>
        <span className="text-xs font-semibold tracking-widest text-muted-foreground">
          {percentage}% OF {totalChapters} CHAPTERS
        </span>
      </div>

      <div className="mt-6 flex flex-1 flex-col justify-center gap-5">
        {subjects.map((subject) => (
          <SubjectProgress key={subject.subject} {...subject} />
        ))}
      </div>

      <p className="mt-6 border-t border-dashed border-border pt-4 text-xs text-muted-foreground">
        A chapter counts as covered at 20 solved questions — not at one.
      </p>
    </div>
  );
}
