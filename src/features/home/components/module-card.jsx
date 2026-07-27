'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';

export function ModuleCard({ moduleKey, label, icon: Icon, href }) {
  const content = (
    <div className="group flex h-full flex-col gap-3 rounded-xl border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        {!href && (
          <Badge variant="secondary" className="text-xs">
            Coming soon
          </Badge>
        )}
      </div>
      <p className="font-medium">{label}</p>
    </div>
  );

  if (!href) {
    return <div className="cursor-not-allowed opacity-70">{content}</div>;
  }

  return (
    <Link href={href} onClick={() => track(ANALYTICS_EVENTS.MODULE_CARD_CLICKED, { module: moduleKey })}>
      {content}
    </Link>
  );
}
