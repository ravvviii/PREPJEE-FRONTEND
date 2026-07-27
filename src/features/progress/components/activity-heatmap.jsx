import { cn } from '@/lib/utils';

export function ActivityHeatmap({ activity = [] }) {
  const activityMap = new Map(activity.map((day) => [day.date, day.attemptCount]));
  const days = Array.from({ length: 90 }, (_, offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (89 - offset));
    const key = date.toISOString().slice(0, 10);
    return { date: key, count: activityMap.get(key) ?? 0 };
  });

  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[38rem] grid-flow-col grid-rows-7 gap-1" aria-label="90-day activity heatmap">
        {days.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.count} attempts`}
            aria-label={`${day.date}: ${day.count} attempts`}
            className={cn(
              'size-4 rounded-[3px]',
              day.count === 0
                ? 'bg-muted'
                : day.count < 3
                  ? 'bg-primary/30'
                  : day.count < 6
                    ? 'bg-primary/60'
                    : 'bg-primary',
            )}
          />
        ))}
      </div>
    </div>
  );
}
