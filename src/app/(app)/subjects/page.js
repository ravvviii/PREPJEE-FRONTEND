'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { SubjectGrid } from '@/features/subjects/components/subject-grid';
import { SubjectHeader } from '@/features/subjects/components/subject-header';
import { SubjectSearch } from '@/features/subjects/components/subject-search';
import { SubjectSkeleton } from '@/features/subjects/components/subject-skeleton';
import { useSubjectsQuery } from '@/features/subjects/hooks/use-subjects-query';
import { useClassesQuery } from '@/features/classes/hooks/use-classes-query';
import { excludeDropper, sortClasses } from '@/features/classes/utils/class-order';
import { useDebounce } from '@/hooks/use-debounce';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';

export default function SubjectsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 400);
  const trackedSearch = useRef('');
  const nextPagePrefetched = useRef(false);
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSubjectsQuery();
  const { data: rawClasses = [], isLoading: classesLoading } = useClassesQuery();
  const classes = useMemo(() => sortClasses(excludeDropper(rawClasses)), [rawClasses]);

  const subjects = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const visibleSubjects = useMemo(() => {
    if (!debouncedSearch) return subjects;
    const normalized = debouncedSearch.toLocaleLowerCase();
    return subjects.filter((subject) => subject.name.toLocaleLowerCase().includes(normalized));
  }, [debouncedSearch, subjects]);

  useEffect(() => {
    track(ANALYTICS_EVENTS.SUBJECT_LIST_VIEWED);
  }, []);

  useEffect(() => {
    if (!hasNextPage || nextPagePrefetched.current) return;
    nextPagePrefetched.current = true;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (!debouncedSearch || trackedSearch.current === debouncedSearch) return;
    trackedSearch.current = debouncedSearch;
    track(ANALYTICS_EVENTS.SUBJECT_SEARCHED, {
      query: debouncedSearch,
      resultCount: visibleSubjects.length,
    });
  }, [debouncedSearch, visibleSubjects.length]);

  function handleSelect(subject, classItem) {
    track(ANALYTICS_EVENTS.SUBJECT_SELECTED, {
      subjectId: subject.id,
      subjectName: subject.name,
      classId: classItem.id,
      className: classItem.name,
    });
  }

  if (isLoading || classesLoading) {
    return (
      <div className="space-y-6">
        <div className="h-56 animate-pulse rounded-2xl bg-muted" />
        <SubjectSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load subjects"
        description={error?.message ?? 'Check your connection and try again.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* <SubjectHeader
        loadedCount={subjects.length}
        visibleCount={visibleSubjects.length}
        isSearching={Boolean(debouncedSearch)}
      /> */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">All subjects</h2>
          <p className="text-sm text-muted-foreground">Find the subject you want to practise today.</p>
        </div>
        <SubjectSearch value={search} onChange={setSearch} />
      </div>

      {subjects.length === 0 ? (
        <EmptyState title="No subjects yet" description="Subjects will appear here once they are available." />
      ) : visibleSubjects.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={`No results for “${debouncedSearch}”`}
          description="Try a different subject name."
          action={
            <Button variant="outline" onClick={() => setSearch('')}>
              Clear search
            </Button>
          }
        />
      ) : (
        <>
          <SubjectGrid subjects={visibleSubjects} classes={classes} onSelect={handleSelect} />
          {hasNextPage && !debouncedSearch && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? 'Loading…' : 'Load more subjects'}
              </Button>
            </div>
          )}
          {isFetchingNextPage && <SubjectSkeleton count={3} />}
        </>
      )}
    </div>
  );
}
