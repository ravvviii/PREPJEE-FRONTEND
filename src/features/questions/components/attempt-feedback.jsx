'use client';

import { CheckCircle2, RotateCcw, Target, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MathContent } from './math-content';

export function AttemptFeedback({ result, accuracy, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4"
    >
      <div
        className={
          result.isCorrect
            ? 'rounded-xl border border-success/30 bg-success/10 p-4'
            : 'rounded-xl border border-destructive/30 bg-destructive/10 p-4'
        }
      >
        <div className="flex items-center gap-3">
          {result.isCorrect ? (
            <CheckCircle2 className="size-6 text-success" aria-hidden="true" />
          ) : (
            <XCircle className="size-6 text-destructive" aria-hidden="true" />
          )}
          <div>
            <p className="font-semibold">{result.isCorrect ? 'Correct answer!' : 'Not quite'}</p>
            <p className="text-sm text-muted-foreground">
              {result.isCorrect
                ? 'Great work—your answer is correct.'
                : 'The correct option is highlighted below. Review the explanation and try again.'}
            </p>
          </div>
        </div>
      </div>

      {result.explanation && (
        <div className="rounded-xl border bg-muted/30 p-5">
          <h3 className="font-semibold">Explanation</h3>
          {result.explanation.explanationText && (
            <MathContent className="mt-3 leading-7 text-muted-foreground">
              {result.explanation.explanationText}
            </MathContent>
          )}
          {result.explanation.solutionImageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={result.explanation.solutionImageUrl}
              alt="Solution illustration"
              loading="lazy"
              decoding="async"
              className="mt-4 max-h-96 rounded-lg border object-contain"
            />
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
        <div className="flex items-center gap-3">
          <Target className="size-5 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">Community accuracy</p>
            <p className="text-xs text-muted-foreground">
              {accuracy
                ? `${accuracy.accuracyPercent}% across ${accuracy.totalAttempts} attempts`
                : 'Updating accuracy…'}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={onRetry}>
          <RotateCcw />
          Retry question
        </Button>
      </div>
    </motion.div>
  );
}
