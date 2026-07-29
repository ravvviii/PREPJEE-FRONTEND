'use client';

import { motion } from 'framer-motion';
import { Sparkle } from 'lucide-react';
import { usePaywall } from '@/features/paywall/providers/paywall-provider';
import { FEATURES } from '@/features/paywall/config/entitlement-policy';

export function UpgradeBanner({
  plan = 'BASIC',
  chaptersVisible = 3,
  totalChapters = 90,
  totalMocks = 24,
  totalShifts = 42,
}) {
  const { triggerPaywall } = usePaywall();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
      className="flex flex-col gap-6 rounded-3xl bg-[#0B0B0B] p-8 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest">
          <Sparkle
            className="h-3.5 w-3.5 fill-[#EEC75E] text-[#EEC75E]"
            strokeWidth={0.5}
          />
          <span className="text-[#EEC75E]">STUDENT PASS</span>
          <span className="text-white/30">|</span>
          <span className="text-white/50">YOU&apos;RE ON {plan}</span>
        </div>

        <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
          You&apos;re seeing {chaptersVisible} chapters a subject. There are{' '}
          {totalChapters}.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
          Student Pro unlocks every chapter, all {totalMocks} mocks, all{' '}
          {totalShifts} past shifts and the analytics that tell you what to
          fix.
        </p>
      </div>

      <button
        onClick={() =>
          triggerPaywall({
            feature: FEATURES.PREMIUM_ACCESS,
            source: 'upgrade_banner',
            title: 'Unlock Student Pass',
            description:
              'Get unlimited JEE practice, PYQs, detailed solutions and advanced analytics.',
          })
        }
        className="shrink-0 self-start rounded-2xl bg-[#EEC75E] px-6 py-3 text-sm font-semibold text-[#0B0B0B] transition-all duration-200 hover:bg-[#f2d47a] sm:self-center"
      >
        Unlock for ₹1
      </button>
    </motion.section>
  );
}
