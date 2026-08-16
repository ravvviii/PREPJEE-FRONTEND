'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatClock(totalSeconds) {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function SetTimer({ expiresAt, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000);
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const isLow = secondsLeft <= 60;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-sm font-semibold',
        isLow ? 'border-destructive/40 bg-destructive/10 text-destructive' : 'bg-muted',
      )}
    >
      <Clock className="size-4" aria-hidden="true" />
      {formatClock(secondsLeft)}
    </div>
  );
}
