'use client';

import { BookmarkX, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MathContent } from '@/features/questions/components/math-content';

export function BookmarkCard({ bookmark, onRemove, isRemoving }) {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {bookmark.difficulty}
          </Badge>
          {bookmark.chapterName && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="size-3.5" aria-hidden="true" />
              {bookmark.chapterName}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(bookmark.questionId)}
          disabled={isRemoving}
          aria-label="Remove bookmark"
          className="text-muted-foreground hover:text-destructive"
        >
          <BookmarkX />
        </Button>
      </div>
      <MathContent className="mt-4 line-clamp-4 leading-7">{bookmark.questionText}</MathContent>
      <p className="mt-4 text-xs text-muted-foreground">
        Saved {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
      </p>
    </article>
  );
}
