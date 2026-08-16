'use client';

import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function OptionButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors',
        selected ? 'border-primary bg-primary/5' : 'hover:bg-muted',
      )}
    >
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border',
          selected && 'border-primary bg-primary text-primary-foreground',
        )}
      >
        {selected && <Check className="size-3.5" />}
      </span>
      {children}
    </button>
  );
}

export function SetQuestionPanel({ question, index, total, answer, onAnswerChange }) {
  return (
    <div className="rounded-2xl border p-6">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground">
        QUESTION {index + 1} OF {total} · {question.difficulty?.toUpperCase()}
      </p>
      <h2 className="mt-3 text-lg font-medium leading-7">{question.questionText}</h2>

      <div className="mt-6 space-y-2">
        {question.answerType === 'single_correct' &&
          question.options.map((option) => (
            <OptionButton
              key={option.id}
              selected={answer?.selectedOptionId === option.id}
              onClick={() => onAnswerChange({ selectedOptionId: option.id })}
            >
              {option.optionText}
            </OptionButton>
          ))}

        {question.answerType === 'multi_correct' &&
          question.options.map((option) => {
            const selectedIds = answer?.selectedOptionIds ?? [];
            const selected = selectedIds.includes(option.id);
            return (
              <OptionButton
                key={option.id}
                selected={selected}
                onClick={() =>
                  onAnswerChange({
                    selectedOptionIds: selected
                      ? selectedIds.filter((id) => id !== option.id)
                      : [...selectedIds, option.id],
                  })
                }
              >
                {option.optionText}
              </OptionButton>
            );
          })}

        {question.answerType === 'numerical' && (
          <div className="max-w-xs space-y-2">
            <Label htmlFor="numerical-answer">Your answer</Label>
            <Input
              id="numerical-answer"
              type="number"
              inputMode="decimal"
              value={answer?.numericalAnswer ?? ''}
              onChange={(event) =>
                onAnswerChange({
                  numericalAnswer: event.target.value === '' ? undefined : Number(event.target.value),
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
