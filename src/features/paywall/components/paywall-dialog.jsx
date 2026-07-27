'use client';

import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, BookOpenCheck, CheckCircle2, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';
import {
  clearCheckoutIdempotencyKey,
  createPaymentOrder,
  getSubscriptionPlans,
  verifyPayment,
} from '../services/payment.api';
import { loadRazorpay } from '../lib/razorpay';
import { PlanCard } from './plan-card';

const BENEFITS = [
  [BookOpenCheck, 'Unlimited chapter practice'],
  [Sparkles, 'Detailed solutions and PYQs'],
  [BarChart3, 'Advanced progress insights'],
];

export function PaywallDialog({ request, onClose, onPaymentSuccess }) {
  const { user, refreshUser } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState(request?.planId ?? null);
  const [paymentState, setPaymentState] = useState('idle');
  const paymentStartingRef = useRef(false);

  const plansQuery = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: getSubscriptionPlans,
    enabled: Boolean(request),
    staleTime: 5 * 60 * 1000,
  });

  const plans = useMemo(() => plansQuery.data?.items ?? [], [plansQuery.data]);
  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) ??
    plans.find((plan) => plan.isDefault) ??
    plans[0];

  const properties = {
    ...request?.metadata,
    source: request?.source,
    feature: request?.feature,
    bucketId: user?.bucketId,
    planId: selectedPlan?.id,
    amount: selectedPlan?.amount,
  };

  const close = () => {
    if (paymentState === 'creating_order' || paymentState === 'verifying') return;
    track(ANALYTICS_EVENTS.PAYWALL_DISMISSED, properties);
    onClose();
  };

  const startPayment = async () => {
    if (!selectedPlan || paymentStartingRef.current) return;
    paymentStartingRef.current = true;
    setPaymentState('creating_order');
    track(ANALYTICS_EVENTS.PAYMENT_STARTED, properties);

    try {
      const [order, scriptLoaded] = await Promise.all([
        createPaymentOrder(selectedPlan.id),
        loadRazorpay(),
      ]);

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Razorpay checkout could not be loaded. Check your connection and retry.');
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'PrepJEE',
        description: `${selectedPlan.name} subscription`,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => {
            setPaymentState('idle');
            track(ANALYTICS_EVENTS.PAYMENT_CANCELLED, properties);
          },
        },
        handler: async (response) => {
          setPaymentState('verifying');
          track(ANALYTICS_EVENTS.PAYMENT_VERIFICATION_STARTED, properties);
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            await refreshUser();
            clearCheckoutIdempotencyKey(selectedPlan.id);
            setPaymentState('success');
            track(ANALYTICS_EVENTS.PAYMENT_SUCCEEDED, properties);
            track(ANALYTICS_EVENTS.SUBSCRIPTION_ACTIVATED, properties);
            toast.success('PrepJEE Premium is now active.');
            onPaymentSuccess();
          } catch (error) {
            setPaymentState('failed');
            track(ANALYTICS_EVENTS.PAYMENT_FAILED, { ...properties, code: error.code });
            toast.error(error.message || 'Payment verification failed. Please retry.');
          }
        },
      });

      checkout.on('payment.failed', (response) => {
        clearCheckoutIdempotencyKey(selectedPlan.id);
        setPaymentState('failed');
        track(ANALYTICS_EVENTS.PAYMENT_FAILED, {
          ...properties,
          code: response.error?.code,
        });
        toast.error(response.error?.description || 'Payment failed. Please retry.');
      });
      setPaymentState('checkout_open');
      track(ANALYTICS_EVENTS.RAZORPAY_OPENED, properties);
      checkout.open();
    } catch (error) {
      if (
        error.code === 'CHECKOUT_ALREADY_COMPLETED' ||
        error.code === 'IDEMPOTENCY_KEY_REUSED'
      ) {
        clearCheckoutIdempotencyKey(selectedPlan.id);
      }
      setPaymentState('failed');
      track(ANALYTICS_EVENTS.PAYMENT_FAILED, { ...properties, code: error.code });
      toast.error(error.message || 'Could not start payment. Please retry.');
    } finally {
      paymentStartingRef.current = false;
    }
  };

  const isBusy = paymentState === 'creating_order' || paymentState === 'verifying';

  return (
    <Dialog open={Boolean(request)} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-lg">
        <div className="rounded-t-xl bg-gradient-to-br from-primary/20 via-primary/5 to-background px-6 pt-7 pb-5">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <DialogHeader className="mt-4">
            <DialogTitle className="text-2xl">{request?.title}</DialogTitle>
            <DialogDescription className="text-sm leading-6">
              {request?.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 pb-6">
          <div className="grid gap-2 sm:grid-cols-3">
            {BENEFITS.map(([Icon, label]) => (
              <div key={label} className="rounded-xl bg-muted/50 p-3">
                <Icon className="size-4 text-primary" aria-hidden="true" />
                <p className="mt-2 text-xs font-medium leading-5">{label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Choose your plan</p>
            {plansQuery.isLoading ? (
              <div className="space-y-3" role="status" aria-label="Loading subscription plans">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
            ) : plansQuery.isError ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <p className="font-medium">Couldn&apos;t load subscription plans.</p>
                <Button variant="link" className="mt-1 h-auto p-0" onClick={() => plansQuery.refetch()}>
                  Try again
                </Button>
              </div>
            ) : plans.length === 0 ? (
              <p className="rounded-xl border p-4 text-sm text-muted-foreground">
                No subscription plans are available right now.
              </p>
            ) : (
              <div className="space-y-3">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    selected={selectedPlan?.id === plan.id}
                    onSelect={(id) => {
                      setSelectedPlanId(id);
                      track(ANALYTICS_EVENTS.PLAN_SELECTED, {
                        ...properties,
                        planId: id,
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {paymentState === 'success' ? (
            <div className="flex items-center gap-3 rounded-xl bg-success/10 p-4 text-success">
              <CheckCircle2 className="size-5" aria-hidden="true" />
              <p className="font-medium">Payment successful. Premium is active.</p>
            </div>
          ) : (
            <Button className="h-12 w-full text-base" disabled={!selectedPlan || isBusy} onClick={startPayment}>
              {isBusy && <Loader2 className="animate-spin" aria-hidden="true" />}
              {paymentState === 'verifying'
                ? 'Verifying payment…'
                : paymentState === 'creating_order'
                  ? 'Starting secure checkout…'
                  : paymentState === 'failed'
                    ? 'Retry payment'
                    : 'Continue with Razorpay'}
            </Button>
          )}

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Secure checkout powered by Razorpay. Prices include the displayed plan duration.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
