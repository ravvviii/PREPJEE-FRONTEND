import { BookOpen, Search } from 'lucide-react';

export function SubjectHeader({ loadedCount, visibleCount, isSearching }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/12 via-card to-card p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <BookOpen className="size-5" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Choose your subject</h1>
          <p className="text-sm leading-6 text-muted-foreground sm:text-base">
            Pick a subject and start strengthening your JEE preparation, one concept at a time.
          </p>
        </div>
        <div className="flex gap-3" aria-label="Subject statistics">
          <div className="min-w-24 rounded-xl border bg-background/70 px-4 py-3 backdrop-blur">
            <p className="text-2xl font-bold">{loadedCount}</p>
            <p className="text-xs text-muted-foreground">Subjects loaded</p>
          </div>
          {isSearching && (
            <div className="min-w-24 rounded-xl border bg-background/70 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-1.5">
                <Search className="size-4 text-primary" aria-hidden="true" />
                <p className="text-2xl font-bold">{visibleCount}</p>
              </div>
              <p className="text-xs text-muted-foreground">Matches</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
