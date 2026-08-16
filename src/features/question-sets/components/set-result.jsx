'use client';

import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function SetResult({ attempt, results, questions, backHref }) {
  const questionById = new Map(questions.map((question) => [question.id, question]));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 text-center">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground">
          {attempt.status === 'expired' ? 'TIME EXPIRED' : 'SUBMITTED'}
        </p>
        <p className="mt-2 text-4xl font-bold">{attempt.scorePercent}%</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {attempt.correctCount} of {attempt.totalQuestions} correct
        </p>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => {
          const question = questionById.get(result.questionId);
          return (
            <div key={result.questionId} className="rounded-2xl border p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium leading-6">
                  {index + 1}. {question?.questionText}
                </p>
                {result.isCorrect ? (
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                ) : (
                  <XCircle className="size-5 shrink-0 text-destructive" aria-hidden="true" />
                )}
              </div>

              {question?.answerType === 'numerical' ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Your answer: <Badge variant="outline">{result.yourNumericalAnswer ?? '—'}</Badge> · Correct
                  answer: <Badge variant="secondary">{result.correctNumericalAnswer}</Badge>
                </p>
              ) : (
                <div className="mt-3 space-y-1.5 text-sm">
                  {question?.options.map((option) => {
                    const isCorrectOption = result.correctOptionIds.includes(option.id);
                    const wasSelected =
                      result.yourSelectedOptionId === option.id ||
                      result.yourSelectedOptionIds?.includes(option.id);
                    return (
                      <p
                        key={option.id}
                        className={
                          isCorrectOption
                            ? 'font-medium text-emerald-700 dark:text-emerald-400'
                            : wasSelected
                              ? 'text-destructive'
                              : 'text-muted-foreground'
                        }
                      >
                        {option.optionText}
                        {isCorrectOption ? ' ✓' : wasSelected ? ' ✗' : ''}
                      </p>
                    );
                  })}
                </div>
              )}

              {result.explanation && (
                <p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">
                  {result.explanation.explanationText}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Button asChild className="w-full sm:w-auto">
        <Link href={backHref}>Back to chapter</Link>
      </Button>
    </div>
  );
}
