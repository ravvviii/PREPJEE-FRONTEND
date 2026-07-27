import { Skeleton } from '@/components/ui/skeleton';

export function ClassSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading classes">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-2xl border p-6">
          <Skeleton className="size-12 rounded-xl" />
          <Skeleton className="mt-5 h-6 w-28" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
