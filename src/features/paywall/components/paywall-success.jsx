'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfettiBurst } from './confetti-burst';
import { PAYWALL_OFFER } from '../config/paywall-offer';

function formatValidTill(expiresAt) {
  if (!expiresAt) return null;
  return new Date(expiresAt)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
}

function renewalCopy(plan) {
  if (!plan?.recurringEnabled) return null;
  const amount = Math.round(plan.amount / 100);
  const interval = plan.billingInterval === 1 ? plan.billingPeriod.replace('ly', '') : `${plan.billingInterval} ${plan.billingPeriod}`;
  return `Renews at ₹${amount} a ${interval}.`;
}

export function PaywallSuccess({ userName, plan, expiresAt, onContinue }) {
  const validTill = formatValidTill(expiresAt);
  const amountPaid = plan ? Math.round((plan.trialAmount ?? plan.amount) / 100) : 1;

  return (
    <div className="relative flex flex-col items-center py-6 text-center">
      <ConfettiBurst />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="relative flex size-14 items-center justify-center rounded-full bg-[#0B0B0B]"
      >
        <motion.span
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border border-[#EEC75E]"
        />
        <Check className="relative size-6 text-[#EEC75E]" strokeWidth={3} />
      </motion.div>

      <p className="mt-4 text-xs font-semibold tracking-widest text-[#B4862C]">
        PAYMENT SUCCESSFUL &nbsp;|&nbsp; &#8377;{amountPaid} PAID
      </p>

      <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground">
        You&apos;re in{userName ? `, ${userName}` : ''}.
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Student Pass is active. Every lock on PrepJEE just came off — and you paid a
        rupee for it.
      </p>

      <div className="mt-8 w-full">
        <div className="h-1.5 w-full rounded-full bg-emerald-500" />
        <div className="mt-2 flex items-center justify-between text-xs font-semibold tracking-widest text-muted-foreground">
          <span>ACCOUNT UNLOCKED</span>
          {validTill && <span>VALID TILL {validTill}</span>}
        </div>
      </div>

      <div className="mt-6 grid w-full grid-cols-2 gap-3 text-left sm:grid-cols-4">
        {PAYWALL_OFFER.unlockedFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + index * 0.08 }}
            className="rounded-2xl border border-border bg-background p-4"
          >
            <span className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                UNLOCKED
              </span>
              <Check className="size-4 text-emerald-600" strokeWidth={3} />
            </span>
            <p className="mt-3 text-sm font-semibold">{feature.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{feature.subtitle}</p>
          </motion.div>
        ))}
      </div>

      <Button
        size="lg"
        onClick={onContinue}
        className="mt-8 h-12 w-full max-w-xs rounded-2xl text-base font-semibold"
      >
        Start solving <ArrowRight className="size-4" />
      </Button>

      {renewalCopy(plan) && (
        <p className="mt-3 text-xs text-muted-foreground">
          Receipt sent to your email. {renewalCopy(plan)}
        </p>
      )}
    </div>
  );
}
