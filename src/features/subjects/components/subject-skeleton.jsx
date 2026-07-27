import { Skeleton } from '@/components/ui/skeleton';

export function SubjectSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading subjects">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border p-5">
          <div className="flex items-start justify-between">
            <Skeleton className="size-12 rounded-xl" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="mt-5 h-6 w-32" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-6 h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
