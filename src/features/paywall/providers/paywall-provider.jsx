'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';
import { evaluateEntitlement, FEATURES } from '../config/entitlement-policy';

const PaywallDialog = dynamic(
  () => import('../components/paywall-dialog').then((module) => module.PaywallDialog),
  { ssr: false },
);

const PaywallContext = createContext(null);

export function PaywallProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [request, setRequest] = useState(null);

  const canAccess = useCallback(
    (feature) => evaluateEntitlement(feature, user),
    [user],
  );

  const triggerPaywall = useCallback(
    (options = {}) => {
      const feature = options.feature ?? FEATURES.PREMIUM_ACCESS;
      const decision = evaluateEntitlement(feature, user);
      if (!options.force && decision.allowed) return false;

      if (!isAuthenticated) return false;

      const nextRequest = {
        feature,
        source: options.source ?? 'manual',
        title: options.title ?? decision.policy.title ?? 'Unlock PrepJEE Premium',
        description:
          options.description ??
          decision.policy.description ??
          'Upgrade to continue using this premium feature.',
        planId: options.planId ?? null,
        metadata: options.metadata ?? {},
        onSuccess: options.onSuccess,
      };
      setRequest(nextRequest);
      track(ANALYTICS_EVENTS.PAYWALL_TRIGGERED, {
        feature,
        source: nextRequest.source,
        bucketId: user?.bucketId,
        reason: decision.reason,
      });
      track(ANALYTICS_EVENTS.PAYWALL_VIEWED, {
        feature,
        source: nextRequest.source,
        bucketId: user?.bucketId,
      });
      return true;
    },
    [isAuthenticated, user],
  );

  const closePaywall = useCallback(() => setRequest(null), []);

  const handlePaymentSuccess = useCallback(() => {
    const completedRequest = request;
    setRequest(null);
    if (completedRequest?.onSuccess) {
      completedRequest.onSuccess();
      track(ANALYTICS_EVENTS.PAYWALL_ACTION_RESUMED, {
        feature: completedRequest.feature,
        source: completedRequest.source,
      });
    }
  }, [request]);

  const value = useMemo(
    () => ({
      isPaywallOpen: Boolean(request),
      triggerPaywall,
      closePaywall,
      canAccess,
    }),
    [request, triggerPaywall, closePaywall, canAccess],
  );

  return (
    <PaywallContext.Provider value={value}>
      {children}
      {request && (
        <PaywallDialog
          request={request}
          onClose={closePaywall}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </PaywallContext.Provider>
  );
}

export function usePaywall() {
  const context = useContext(PaywallContext);
  if (!context) throw new Error('usePaywall must be used within PaywallProvider');
  return context;
}
