'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePaywall } from '@/features/paywall/providers/paywall-provider';
import { FEATURES } from '@/features/paywall/config/entitlement-policy';

export function StudentPass({ className, onClick }) {

    const { triggerPaywall } = usePaywall();
  return (
    <button
      onClick={() =>
        triggerPaywall({
          feature: FEATURES.PREMIUM_ACCESS,
          source: 'navbar_student_pass',
          title: 'Unlock Student Pass',
          description:'Get unlimited JEE practice, PYQs, detailed solutions and advanced analytics.',
        })
      }
      className={cn(
        'inline-flex items-center gap-2 rounded-2xl border border-[#EEC75E] bg-[#0B0B0B] px-5 py-2 transition-all duration-200 hover:bg-[#151515] hover:shadow-[0_0_20px_rgba(238,199,94,0.2)]',
        className
      )}
    >
      <Sparkles
        className="h-5 w-5 fill-[#EEC75E] text-[#EEC75E]"
        strokeWidth={1.8}
      />

      <span className="text-base font-semibold text-[#EEC75E]">
        Student Pass
      </span>
    </button>
  );
}