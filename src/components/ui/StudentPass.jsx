'use client';

import { Sparkle, Sparkles } from 'lucide-react';
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
        'inline-flex items-center gap-1 rounded-lg  bg-[#0B0B0B] px-4 py-1 transition-all duration-200 hover:bg-[#151515] hover:shadow-[0_0_20px_rgba(238,199,94,0.2)]',
        className
      )}
    >
      <Sparkle
        className="h-4 w-4 fill-[#EEC75E] text-[#EEC75E]"
        strokeWidth={0.5}
      />

      <span className="text-base font-medium text-[#EEC75E]">
        Student Pass
      </span>
    </button>
  );
}