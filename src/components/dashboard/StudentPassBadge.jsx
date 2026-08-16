'use client';

import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePaywall } from '@/features/paywall/providers/paywall-provider';
import { FEATURES } from '@/features/paywall/config/entitlement-policy';

export function StudentPassBadge({ className }) {
  const { triggerPaywall } = usePaywall();

  return (
    <button
      onClick={() =>
        triggerPaywall({
          feature: FEATURES.PREMIUM_ACCESS,
          source: 'progress_overview_badge',
          title: 'Unlock Student Pass',
          description:
            'Get unlimited JEE practice, PYQs, detailed solutions and advanced analytics.',
        })
      }
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-[#EEC75E]/40 bg-[#EEC75E]/10 px-3 py-1 transition-all duration-200 hover:bg-[#EEC75E]/15',
        className
      )}
    >
      <Lock className="h-3.5 w-3.5 text-[#EEC75E]" strokeWidth={2} />
      <span className="text-xs font-semibold tracking-wide text-[#EEC75E]">
        LOCKED
      </span>
    </button>
  );
}
