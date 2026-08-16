'use client';

import { Check } from 'lucide-react';

export function PaywallBenefits({ benefits, refundNote }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-[#B4862C]">
        WHAT YOU GET
      </p>

      <ul className="mt-3 divide-y divide-[#EEC75E]/20">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-center gap-3 py-4">
            <Check className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={3} />
            <span className="text-base font-medium">{benefit}</span>
          </li>
        ))}
      </ul>

      {refundNote && (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          {refundNote}
        </p>
      )}
    </div>
  );
}
