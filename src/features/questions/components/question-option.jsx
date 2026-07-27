'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MathContent } from './math-content';

const LABELS = ['A', 'B', 'C', 'D'];

export function QuestionOption({ option, index, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-[border-color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        selected ? 'border-primary bg-primary/8 shadow-sm' : 'bg-card hover:border-primary/35 hover:bg-muted/30',
      )}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold',
          selected ? 'border-primary bg-primary text-primary-foreground' : 'bg-background',
        )}
      >
        {selected ? <Check className="size-4" /> : LABELS[index] ?? index + 1}
      </span>
      <div className="min-w-0 flex-1 pt-1">
        {option.optionText && <MathContent className="leading-6">{option.optionText}</MathContent>}
        {option.optionImageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={option.optionImageUrl}
            alt={`Option ${LABELS[index] ?? index + 1}`}
            className="mt-2 max-h-64 rounded-lg object-contain"
          />
        )}
      </div>
    </button>
  );
}
