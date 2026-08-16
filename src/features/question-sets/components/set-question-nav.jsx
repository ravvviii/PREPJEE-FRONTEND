'use client';

import { cn } from '@/lib/utils';

export function SetQuestionNav({ questions, answers, currentIndex, onJump }) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-5">
      {questions.map((question, index) => {
        const isAnswered = Boolean(answers[question.id]);
        const isCurrent = index === currentIndex;
        return (
          <button
            key={question.id}
            type="button"
            onClick={() => onJump(index)}
            className={cn(
              'flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors',
              isCurrent
                ? 'border-primary bg-primary text-primary-foreground'
                : isAnswered
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'hover:bg-muted',
            )}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
