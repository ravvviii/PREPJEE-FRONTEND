'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, LibraryBig, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { ChapterCard } from './chapter-card';
import { ChapterFilters } from './chapter-filters';
import { useChaptersQuery } from '../hooks/use-chapters-query';
import { getChapterDifficulty } from '../utils/chapter';
import { useDebounce } from '@/hooks/use-debounce';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';

const DIFFICULTY_RANK = { easy: 1, medium: 2, hard: 3 };

function ChapterSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-72 rounded-2xl" />
      ))}
    </div>
  );
}

export function ChapterBrowser({ subjectId, classId, subjectName, className }) {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [sort, setSort] = useState('default');
  const debouncedSearch = useDebounce(search.trim(), 350);
  const { data: chapters = [], isLoading, isFetching, isError, error, refetch } = useChaptersQuery({
    subjectId,
    classId,
    search: debouncedSearch,
  });

  useEffect(() => {
    track(ANALYTICS_EVENTS.CHAPTER_VIEWED, { subjectId, classId, subjectName, className });
  }, [classId, className, subjectId, subjectName]);

  const visibleChapters = useMemo(() => {
    const filtered = chapters.filter((chapter) => {
      if (difficulty === 'all') return true;
      const chapterDifficulty = getChapterDifficulty(chapter);
      return difficulty === 'unrated' ? !chapterDifficulty : chapterDifficulty === difficulty;
    });

    if (sort === 'name-asc') return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'questions-desc')
      return [...filtered].sort((a, b) => (b.questionCount ?? 0) - (a.questionCount ?? 0));
    if (sort === 'progress-desc')
      return [...filtered].sort((a, b) => (b.progressPercent ?? 0) - (a.progressPercent ?? 0));
    if (sort === 'difficulty-desc')
      return [...filtered].sort(
        (a, b) =>
          (DIFFICULTY_RANK[getChapterDifficulty(b)] ?? 0) -
          (DIFFICULTY_RANK[getChapterDifficulty(a)] ?? 0),
      );
    return filtered;
  }, [chapters, difficulty, sort]);

  function handleSelect(chapter) {
    track(ANALYTICS_EVENTS.CHAPTER_SELECTED, {
      chapterId: chapter.id,
      chapterName: chapter.name,
      subjectId,
      classId,
    });
  }

  return (
    <div className="space-y-2">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href={`/subjects/${subjectId}/classes?subject=${encodeURIComponent(subjectName)}`}>
          <ArrowLeft aria-hidden="true" />
          Back to classes
        </Link>
      </Button>

      <div className="rounded-2xl border bg-gradient-to-br from-primary/12 via-card to-card  sm:p-8">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <LibraryBig className="size-5" aria-hidden="true" />
        </div>
        <p className="mt-1 text-sm font-medium text-primary">
          {subjectName} · {className}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">NCERT chapters</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Choose a chapter to review concepts and start practising questions.
        </p>
      </div>

      <ChapterFilters
        search={search}
        onSearchChange={setSearch}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        sort={sort}
        onSortChange={setSort}
      />

      {isLoading ? (
        <ChapterSkeleton />
      ) : isError ? (
        <ErrorState
          title="Couldn't load chapters"
          description={error?.message ?? 'Check your connection and try again.'}
          onRetry={refetch}
        />
      ) : chapters.length === 0 && !debouncedSearch ? (
        <EmptyState
          title="No chapters available"
          description={`No NCERT chapters are available for ${subjectName} · ${className} yet.`}
        />
      ) : visibleChapters.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No matching chapters"
          description="Try changing your search or difficulty filter."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setDifficulty('all');
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <div className="mb-3 text-sm text-muted-foreground">
            {visibleChapters.length} {visibleChapters.length === 1 ? 'chapter' : 'chapters'}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                href={`/subjects/${subjectId}/classes/${classId}/chapters/${chapter.id}?subject=${encodeURIComponent(subjectName)}&class=${encodeURIComponent(className)}&chapter=${encodeURIComponent(chapter.name)}`}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
