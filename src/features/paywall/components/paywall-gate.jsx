'use client';

import { LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePaywall } from '../providers/paywall-provider';

export function PaywallGate({
  feature,
  source,
  title,
  description,
  metadata,
  children,
  fallback,
}) {
  const { canAccess, triggerPaywall } = usePaywall();
  const decision = canAccess(feature);

  if (decision.allowed) return children;
  if (fallback) return fallback;

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-background p-6 text-center">
      <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <LockKeyhole className="size-5" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-semibold">{title ?? decision.policy.title ?? 'Premium feature'}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description ?? decision.policy.description ?? 'Upgrade to unlock this feature.'}
      </p>
      <Button
        className="mt-5"
        onClick={() => triggerPaywall({ feature, source, title, description, metadata })}
      >
        View Premium plans
      </Button>
    </div>
  );
}
