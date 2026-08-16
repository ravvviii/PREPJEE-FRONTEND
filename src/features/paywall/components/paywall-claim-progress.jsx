'use client';

export function PaywallClaimProgress({ claimedToday, spotsLeft, spotsTotal }) {
  const percentage = spotsTotal > 0 ? Math.min(100, Math.round((claimedToday / spotsTotal) * 100)) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          {claimedToday.toLocaleString()} claimed today
        </span>
        <span className="text-xs font-semibold tracking-widest text-muted-foreground">
          {spotsLeft} LEFT
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEC75E]/20">
        <div
          className="h-full rounded-full bg-[#EEC75E]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
