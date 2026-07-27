import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingOverlay({ label = 'Loading…', fullScreen = false, className }) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm',
        fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10',
        className,
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
