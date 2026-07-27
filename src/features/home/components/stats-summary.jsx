import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatsSummary({ stats }) {
  const items = [
    { label: 'Questions attempted', value: stats?.totalAttempts ?? 0 },
    { label: 'Correct answers', value: stats?.correctAttempts ?? 0 },
    { label: 'Accuracy', value: `${stats?.accuracyPercent ?? 0}%` },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
