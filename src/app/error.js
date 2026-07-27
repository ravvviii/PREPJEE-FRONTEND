'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    track(ANALYTICS_EVENTS.UNHANDLED_ERROR, { message: error?.message, digest: error?.digest });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-destructive">500</p>
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="max-w-sm text-muted-foreground">
        An unexpected error occurred. Try again, or come back in a moment.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
