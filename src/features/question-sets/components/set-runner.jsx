'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { QUERY_KEYS } from '@/constants/query-keys';
import { startSetAttempt, submitSetAttempt } from '@/services/api/question-set.api';
import { SetTimer } from './set-timer';
import { SetQuestionPanel } from './set-question-panel';
import { SetQuestionNav } from './set-question-nav';
import { SetResult } from './set-result';

function buildAnswerPayload(answers) {
  return Object.entries(answers).map(([questionId, answer]) => ({ questionId, ...answer }));
}

export function SetRunner({ setId, backHref }) {
  const queryClient = useQueryClient();
  const startedRef = useRef(false);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [startError, setStartError] = useState(null);

  const startMutation = useMutation({
    mutationFn: () => startSetAttempt(setId),
    onSuccess: (data) => {
      setAttempt(data.attempt);
      setQuestions(data.questions);
    },
    onError: (error) => setStartError(error),
  });

  const submitMutation = useMutation({
    mutationFn: () => submitSetAttempt(attempt.id, buildAnswerPayload(answers)),
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROGRESS });
      toast.success(
        data.attempt.status === 'expired' ? "Time's up — here's how you did." : 'Submitted!',
      );
    },
    onError: (error) => toast.error(error.message || 'Could not submit. Please retry.'),
  });

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (startError) {
    return (
      <ErrorState
        title="Couldn't start this set"
        description={startError.message ?? 'Check your connection and try again.'}
        onRetry={() => {
          setStartError(null);
          startMutation.mutate();
        }}
      />
    );
  }

  if (!attempt) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 rounded-full" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (result) {
    return <SetResult attempt={result.attempt} results={result.results} questions={questions} backHref={backHref} />;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}>
          Exit &amp; submit
        </Button>
        <SetTimer expiresAt={attempt.expiresAt} onExpire={() => submitMutation.mutate()} />
      </div>

      <SetQuestionPanel
        question={currentQuestion}
        index={currentIndex}
        total={questions.length}
        answer={answers[currentQuestion.id]}
        onAnswerChange={(patch) =>
          setAnswers((current) => ({ ...current, [currentQuestion.id]: { ...current[currentQuestion.id], ...patch } }))
        }
      />

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((index) => index - 1)}
        >
          <ArrowLeft className="size-4" /> Previous
        </Button>
        {currentIndex === questions.length - 1 ? (
          <Button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}>
            Submit
          </Button>
        ) : (
          <Button onClick={() => setCurrentIndex((index) => index + 1)}>
            Next <ArrowRight className="size-4" />
          </Button>
        )}
      </div>

      <SetQuestionNav
        questions={questions}
        answers={answers}
        currentIndex={currentIndex}
        onJump={setCurrentIndex}
      />
    </div>
  );
}
