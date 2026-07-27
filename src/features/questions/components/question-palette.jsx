'use client';

import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QuestionPalette({ questions, currentIndex, selectedAnswers, bookmarkedIds, onSelect }) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-5">
        {questions.map((question, index) => {
          const answered = selectedAnswers.has(question.id);
          const bookmarked = bookmarkedIds.has(question.id);
          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Go to question ${index + 1}${answered ? ', answered' : ''}`}
              aria-current={currentIndex === index ? 'step' : undefined}
              className={cn(
                'relative flex aspect-square items-center justify-center rounded-lg border text-sm font-medium transition-colors',
                currentIndex === index
                  ? 'border-primary bg-primary text-primary-foreground'
                  : answered
                    ? 'border-success/40 bg-success/10 text-success'
                    : 'bg-card hover:border-primary/40',
              )}
            >
              {index + 1}
              {bookmarked && (
                <Bookmark
                  className="absolute -top-1 -right-1 size-3 fill-warning text-warning"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-primary" /> Current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-success/50" /> Answered
        </span>
        <span className="flex items-center gap-1.5">
          <Bookmark className="size-3 fill-warning text-warning" /> Bookmarked
        </span>
      </div>
    </div>
  );
}
