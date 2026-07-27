'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ChapterFilters({ search, onSearchChange, difficulty, onDifficultyChange, sort, onSortChange }) {
  return (
    <div className="sticky top-20 z-20 rounded-2xl border bg-background/90 p-3 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search chapters..."
            aria-label="Search chapters"
            className="h-10 pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger className="h-10 flex-1 sm:w-40" aria-label="Filter by difficulty">
              <SlidersHorizontal aria-hidden="true" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="unrated">Not rated</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="h-10 flex-1 sm:w-44" aria-label="Sort chapters">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">NCERT order</SelectItem>
              <SelectItem value="name-asc">Name: A–Z</SelectItem>
              <SelectItem value="questions-desc">Most questions</SelectItem>
              <SelectItem value="progress-desc">Most progress</SelectItem>
              <SelectItem value="difficulty-desc">Hardest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
