'use client';

import { Loader2, Sparkle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCountdown } from '@/features/paywall/hooks/use-countdown';
import { PaywallClaimProgress } from '@/features/paywall/components/paywall-claim-progress';

function rupees(paise) {
  return Math.round(paise / 100);
}

function renewalCopy(plan) {
  if (!plan.recurringEnabled) {
    return `${plan.durationDays} days of Premium access`;
  }
  const interval = plan.billingInterval === 1 ? plan.billingPeriod : `${plan.billingInterval} ${plan.billingPeriod}s`;
  return `then ₹${rupees(plan.amount)} / ${interval}`;
}

export function PaywallPricePanel({
  plan,
  offerDurationSeconds,
  claimedToday,
  spotsLeft,
  spotsTotal,
  isBusy,
  buttonLabel,
  onCheckout,
}) {
  const timeLeft = useCountdown(offerDurationSeconds);
  const hasTrial = plan.recurringEnabled && plan.trialAmount != null && plan.trialEligible !== false;
  const headlinePrice = hasTrial ? rupees(plan.trialAmount) : rupees(plan.amount);
  const discountPercent = hasTrial ? Math.round((1 - plan.trialAmount / plan.amount) * 100) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-widest">
        <Sparkle className="h-3.5 w-3.5 fill-[#EEC75E] text-[#EEC75E]" strokeWidth={0.5} />
        <span className="text-[#B4862C]">STUDENT PASS</span>
        {/* <span className="text-foreground/20">|</span> */}
        {/* <span className="text-muted-foreground">ENDS IN {timeLeft}</span> */}
      </div>

      <h1 className="text-5xl font-bold leading-[1.05] text-foreground">
        Everything,
        <br />
        for &#8377;{headlinePrice}.
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        {discountPercent > 0 && (
          <span className="rounded-lg bg-[#0B0B0B] px-3 py-1.5 text-sm font-bold text-[#EEC75E]">
            {discountPercent}% <span className="text-xs font-semibold">OFF</span>
          </span>
        )}
        <span className="text-sm font-semibold">only for you</span>
        <span className="text-foreground/20">|</span>
        <span className="text-sm text-muted-foreground">{renewalCopy(plan)}</span>
      </div>

      <div className="border-t border-[#EEC75E]/20 pt-6">
        <PaywallClaimProgress claimedToday={claimedToday} spotsLeft={spotsLeft} spotsTotal={spotsTotal} />
      </div>

      <Button
        size="lg"
        disabled={isBusy}
        onClick={onCheckout}
        className="h-14 w-full rounded-2xl bg-[#0B0B0B] text-base font-semibold text-[#EEC75E] hover:bg-[#151515]"
      >
        {isBusy && <Loader2 className="animate-spin" aria-hidden="true" />}
        {buttonLabel}
      </Button>

      <p className="text-center text-xs font-semibold tracking-widest text-muted-foreground">
        UPI &middot; CARDS &middot; CANCEL ANY TIME
      </p>
    </div>
  );
}
