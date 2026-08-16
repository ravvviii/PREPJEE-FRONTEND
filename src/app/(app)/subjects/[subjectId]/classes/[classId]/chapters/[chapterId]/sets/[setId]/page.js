'use client';

import Link from 'next/link';
import { use } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SetRunner } from '@/features/question-sets/components/set-runner';

export default function SetRunnerPage({ params, searchParams }) {
  const { subjectId, classId, chapterId, setId } = use(params);
  const { subject = '', class: className = '', chapter = '' } = use(searchParams);

  const chapterHref = `/subjects/${subjectId}/classes/${classId}/chapters/${chapterId}?subject=${encodeURIComponent(subject)}&class=${encodeURIComponent(className)}&chapter=${encodeURIComponent(chapter)}`;

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href={chapterHref}>
          <ArrowLeft aria-hidden="true" />
          Back to chapter
        </Link>
      </Button>

      <SetRunner setId={setId} backHref={chapterHref} />
    </div>
  );
}
