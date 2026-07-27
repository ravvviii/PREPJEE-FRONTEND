'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/context/AuthContext';
import { createQueryClient } from './query-client';
import { AnalyticsProvider } from './analytics-provider';
import { PwaProvider } from './pwa-provider';
import { PaywallProvider } from '@/features/paywall/providers/paywall-provider';

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(
        () =>
          import('@tanstack/react-query-devtools').then(
            (module) => module.ReactQueryDevtools,
          ),
        { ssr: false },
      )
    : null;

export function Providers({ children }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PaywallProvider>
            <TooltipProvider>
              <AnalyticsProvider>
                <PwaProvider />
                {children}
              </AnalyticsProvider>
              <Toaster richColors position="top-center" />
            </TooltipProvider>
          </PaywallProvider>
        </AuthProvider>
        {ReactQueryDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
