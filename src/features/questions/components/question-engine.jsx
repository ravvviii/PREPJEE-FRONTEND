'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Expand,
  Grid3X3,
  Minimize,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { MathContent } from './math-content';
import { QuestionOption } from './question-option';
import { QuestionPalette } from './question-palette';
import { AttemptFeedback } from './attempt-feedback';
import { useQuestionDetail, useQuestionList } from '../hooks/use-question-session';
import { useQuestionBookmarks } from '../hooks/use-question-bookmarks';
import { useQuestionAttempt } from '../hooks/use-question-attempt';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';
import { cn } from '@/lib/utils';

export function QuestionEngine({
  chapterId,
  subjectId,
  classId,
  subjectName,
  className,
  chapterName,
  pyqOnly,
}) {
  const engineRef = useRef(null);
  const viewedQuestionId = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(() => new Map());
  const [attemptResults, setAttemptResults] = useState(() => new Map());
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const listQuery = useQuestionList({ chapterId });
  const allQuestions = useMemo(
    () => listQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [listQuery.data],
  );
  const questions = useMemo(
    () => (pyqOnly ? allQuestions.filter((question) => question.yearId) : allQuestions),
    [allQuestions, pyqOnly],
  );
  const currentSummary = questions[currentIndex];
  const detailQuery = useQuestionDetail(currentSummary?.id);
  const { bookmarkedIds, toggleBookmark, isUpdating } = useQuestionBookmarks();
  const { submit, isSubmitting, accuracy } = useQuestionAttempt(currentSummary?.id, {
    onSuccess: (result) => {
      setAttemptResults((previous) => {
        const next = new Map(previous);
        next.set(currentSummary.id, result);
        return next;
      });
      track(ANALYTICS_EVENTS.ANSWER_SUBMITTED, {
        questionId: currentSummary.id,
        chapterId,
        isCorrect: result.isCorrect,
      });
      track(
        result.isCorrect ? ANALYTICS_EVENTS.ANSWER_CORRECT : ANALYTICS_EVENTS.ANSWER_WRONG,
        { questionId: currentSummary.id, chapterId },
      );
    },
  });

  const chaptersHref = `/subjects/${subjectId}/classes/${classId}/chapters?subject=${encodeURIComponent(subjectName)}&class=${encodeURIComponent(className)}`;

  useEffect(() => {
    if (!currentSummary || viewedQuestionId.current === currentSummary.id) return;
    viewedQuestionId.current = currentSummary.id;
    track(ANALYTICS_EVENTS.QUESTION_VIEWED, {
      questionId: currentSummary.id,
      chapterId,
      position: currentIndex + 1,
      mode: pyqOnly ? 'pyq' : 'practice',
    });
  }, [chapterId, currentIndex, currentSummary, pyqOnly]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const goTo = useCallback(
    (index, eventName) => {
      if (index < 0 || index >= questions.length) return;
      setCurrentIndex(index);
      setPaletteOpen(false);
      if (eventName) {
        track(eventName, {
          chapterId,
          fromPosition: currentIndex + 1,
          toPosition: index + 1,
        });
      }
    },
    [chapterId, currentIndex, questions.length],
  );

  const goNext = useCallback(
    () => goTo(currentIndex + 1, ANALYTICS_EVENTS.QUESTION_NEXT),
    [currentIndex, goTo],
  );
  const goPrevious = useCallback(
    () => goTo(currentIndex - 1, ANALYTICS_EVENTS.QUESTION_PREVIOUS),
    [currentIndex, goTo],
  );

  const selectOption = useCallback(
    (optionIndex) => {
      const detail = detailQuery.data;
      if (!detail?.options?.[optionIndex] || attemptResults.has(detail.id)) return;
      setSelectedAnswers((previous) => {
        const next = new Map(previous);
        next.set(detail.id, detail.options[optionIndex].id);
        return next;
      });
    },
    [attemptResults, detailQuery.data],
  );

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') goPrevious();
      if (/^[1-4]$/.test(event.key)) selectOption(Number(event.key) - 1);
      if (event.key.toLowerCase() === 'b' && currentSummary) toggleBookmark(currentSummary.id);
      if (event.key.toLowerCase() === 'f') {
        if (document.fullscreenElement) document.exitFullscreen();
        else engineRef.current?.requestFullscreen();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSummary, goNext, goPrevious, selectOption, toggleBookmark]);

  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await engineRef.current?.requestFullscreen();
  }

  if (listQuery.isLoading) return <Skeleton className="h-[36rem] rounded-2xl" />;
  if (listQuery.isError) {
    return (
      <ErrorState
        title="Couldn't load questions"
        description={listQuery.error?.message}
        onRetry={listQuery.refetch}
      />
    );
  }
  if (questions.length === 0) {
    return (
      <EmptyState
        title={pyqOnly ? 'No PYQs available' : 'No questions available'}
        description={`There are no published ${pyqOnly ? 'previous-year questions' : 'questions'} for ${chapterName} yet.`}
        action={
          <Button variant="outline" asChild>
            <Link href={chaptersHref}>Back to chapters</Link>
          </Button>
        }
      />
    );
  }

  const question = detailQuery.data;
  const selectedOptionId = question ? selectedAnswers.get(question.id) : null;
  const attemptResult = question ? attemptResults.get(question.id) : null;

  function handleSubmit() {
    if (!question || !selectedOptionId || attemptResult) return;
    submit({ selectedOptionId });
  }

  function handleRetry() {
    if (!question) return;
    setSelectedAnswers((previous) => {
      const next = new Map(previous);
      next.delete(question.id);
      return next;
    });
    setAttemptResults((previous) => {
      const next = new Map(previous);
      next.delete(question.id);
      return next;
    });
  }

  return (
    <div ref={engineRef} className={cn('bg-background', isFullscreen && 'h-screen overflow-auto p-4 sm:p-6')}>
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3">
          <div className="flex min-w-0 items-center gap-2">
            <Button variant="ghost" size="icon" asChild aria-label="Back to chapters">
              <Link href={chaptersHref}>
                <ArrowLeft />
              </Link>
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{chapterName}</p>
              <p className="text-xs text-muted-foreground">
                {pyqOnly ? 'Previous-year questions' : 'Practice'} · Question {currentIndex + 1} of{' '}
                {questions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Sheet open={paletteOpen} onOpenChange={setPaletteOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open question palette">
                  <Grid3X3 />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Question palette</SheetTitle>
                </SheetHeader>
                <div className="px-4">
                  <QuestionPalette
                    questions={questions}
                    currentIndex={currentIndex}
                    selectedAnswers={selectedAnswers}
                    bookmarkedIds={bookmarkedIds}
                    onSelect={goTo}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBookmark(currentSummary.id)}
              disabled={isUpdating}
              aria-label={bookmarkedIds.has(currentSummary.id) ? 'Remove bookmark' : 'Bookmark question'}
            >
              <Bookmark className={bookmarkedIds.has(currentSummary.id) ? 'fill-warning text-warning' : ''} />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
              {isFullscreen ? <Minimize /> : <Expand />}
            </Button>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <main className="rounded-2xl border bg-card p-5 sm:p-7">
            {detailQuery.isLoading ? (
              <div className="space-y-5">
                <Skeleton className="h-24 w-full" />
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            ) : detailQuery.isError ? (
              <ErrorState
                title="Couldn't load this question"
                description={detailQuery.error?.message}
                onRetry={detailQuery.refetch}
              />
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {question.difficulty}
                  </Badge>
                  {question.yearId && <Badge variant="outline">PYQ</Badge>}
                </div>
                <MathContent className="mt-5 text-base leading-7 sm:text-lg">{question.questionText}</MathContent>
                {question.questionImageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={question.questionImageUrl}
                    alt="Question illustration"
                    className="mt-5 max-h-96 rounded-xl border object-contain"
                  />
                )}
                <div className="mt-7 space-y-3">
                  {question.options.slice(0, 4).map((option, index) => (
                    <QuestionOption
                      key={option.id}
                      option={option}
                      index={index}
                      selected={selectedOptionId === option.id}
                      resultState={
                        attemptResult?.correctOptionIds.includes(option.id)
                          ? 'correct'
                          : attemptResult && selectedOptionId === option.id
                            ? 'wrong'
                            : null
                      }
                      disabled={Boolean(attemptResult)}
                      onSelect={() => selectOption(index)}
                    />
                  ))}
                </div>
                {!attemptResult && (
                  <div className="mt-5 flex justify-end">
                    <Button onClick={handleSubmit} disabled={!selectedOptionId || isSubmitting}>
                      {isSubmitting ? 'Submitting…' : 'Submit answer'}
                    </Button>
                  </div>
                )}
                {attemptResult && (
                  <AttemptFeedback result={attemptResult} accuracy={accuracy} onRetry={handleRetry} />
                )}
              </>
            )}

            <div className="mt-7 flex items-center justify-between border-t pt-5">
              <Button variant="outline" onClick={goPrevious} disabled={currentIndex === 0}>
                <ChevronLeft />
                Previous
              </Button>
              <Button onClick={goNext} disabled={currentIndex === questions.length - 1}>
                Next
                <ChevronRight />
              </Button>
            </div>
          </main>

          <aside className="hidden rounded-2xl border bg-card p-4 lg:block">
            <div className="mb-4 flex items-center gap-2">
              <Grid3X3 className="size-4 text-primary" />
              <h2 className="font-semibold">Question palette</h2>
            </div>
            <QuestionPalette
              questions={questions}
              currentIndex={currentIndex}
              selectedAnswers={selectedAnswers}
              bookmarkedIds={bookmarkedIds}
              onSelect={goTo}
            />
            <div className="mt-6 rounded-xl bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">
              <p className="font-medium text-foreground">Keyboard shortcuts</p>
              <p>← / → Navigate · 1–4 Select option</p>
              <p>B Bookmark · F Fullscreen</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
