'use client';

import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';
import { THEME_COLORS } from '@/config/theme';
import { PAYWALL_OFFER } from '../config/paywall-offer';
import {
  clearCheckoutIdempotencyKey,
  createPaymentOrder,
  createRecurringSubscription,
  getSubscriptionPlans,
  verifyPayment,
  verifyRecurringSubscription,
} from '../services/payment.api';
import { loadRazorpay } from '../lib/razorpay';
import { PaywallPricePanel } from './paywall-price-panel';
import { PaywallBenefits } from './paywall-benefits';
import { PaywallSuccess } from './paywall-success';

export function PaywallDialog({ request, onClose, onPaymentSuccess }) {
  const { user, refreshUser } = useAuth();
  const [paymentState, setPaymentState] = useState('idle');
  const [dialogVisible, setDialogVisible] = useState(true);
  const paymentStartingRef = useRef(false);

  const plansQuery = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: getSubscriptionPlans,
    enabled: Boolean(request),
    staleTime: 5 * 60 * 1000,
  });

  const plans = useMemo(() => plansQuery.data?.items ?? [], [plansQuery.data]);
  const selectedPlan =
    plans.find((plan) => plan.id === request?.planId) ??
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
    if (paymentState === 'success') {
      onPaymentSuccess();
      return;
    }
    track(ANALYTICS_EVENTS.PAYWALL_DISMISSED, properties);
    onClose();
  };

  const paymentHandledRef = useRef(false);

  const startPayment = async () => {
    if (!selectedPlan || paymentStartingRef.current) return;
    paymentStartingRef.current = true;
    paymentHandledRef.current = false;
    setPaymentState('creating_order');
    track(ANALYTICS_EVENTS.PAYMENT_STARTED, properties);

    try {
      const [checkoutData, scriptLoaded] = await Promise.all([
        selectedPlan.recurringEnabled
          ? createRecurringSubscription(selectedPlan.id)
          : createPaymentOrder(selectedPlan.id),
        loadRazorpay(),
      ]);

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Razorpay checkout could not be loaded. Check your connection and retry.');
      }

      const checkout = new window.Razorpay({
        key: checkoutData.keyId,
        ...(selectedPlan.recurringEnabled
          ? { subscription_id: checkoutData.subscriptionId }
          : {
              amount: checkoutData.amount,
              currency: checkoutData.currency,
              order_id: checkoutData.orderId,
            }),
        name: 'PrepJEE',
        description: `${selectedPlan.name} subscription`,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: THEME_COLORS.external.primary },
        modal: {
          ondismiss: () => {
            // Razorpay also fires ondismiss when it auto-closes the widget after
            // a successful payment, right as `handler` is verifying — this guard
            // stops that from stomping the in-flight/succeeded state back to idle.
            // In that case `handler` itself is responsible for bringing our
            // dialog back (once verification settles), not this callback.
            if (paymentHandledRef.current) return;
            setPaymentState('idle');
            setDialogVisible(true);
            track(ANALYTICS_EVENTS.PAYMENT_CANCELLED, properties);
          },
        },
        handler: async (response) => {
          paymentHandledRef.current = true;
          setPaymentState('verifying');
          track(ANALYTICS_EVENTS.PAYMENT_VERIFICATION_STARTED, properties);
          try {
            if (selectedPlan.recurringEnabled) {
              await verifyRecurringSubscription({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySubscriptionId: response.razorpay_subscription_id,
                razorpaySignature: response.razorpay_signature,
              });
            } else {
              await verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
            }
            await refreshUser();
            clearCheckoutIdempotencyKey(selectedPlan.id);
            setPaymentState('success');
            setDialogVisible(true);
            track(ANALYTICS_EVENTS.PAYMENT_SUCCEEDED, properties);
            track(ANALYTICS_EVENTS.SUBSCRIPTION_ACTIVATED, properties);
            toast.success(
              selectedPlan.recurringEnabled && selectedPlan.trialDays
                ? `Your ${selectedPlan.trialDays}-day Premium trial is active.`
                : 'PrepJEE Premium is now active.',
            );
          } catch (error) {
            setPaymentState('failed');
            setDialogVisible(true);
            track(ANALYTICS_EVENTS.PAYMENT_FAILED, { ...properties, code: error.code });
            toast.error(error.message || 'Payment verification failed. Please retry.');
          }
        },
      });

      checkout.on('payment.failed', (response) => {
        clearCheckoutIdempotencyKey(selectedPlan.id);
        setPaymentState('failed');
        setDialogVisible(true);
        track(ANALYTICS_EVENTS.PAYMENT_FAILED, {
          ...properties,
          code: response.error?.code,
        });
        toast.error(response.error?.description || 'Payment failed. Please retry.');
      });
      setPaymentState('checkout_open');
      setDialogVisible(false);
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
      setDialogVisible(true);
      track(ANALYTICS_EVENTS.PAYMENT_FAILED, { ...properties, code: error.code });
      toast.error(error.message || 'Could not start payment. Please retry.');
    } finally {
      paymentStartingRef.current = false;
    }
  };

  const isBusy = paymentState === 'creating_order' || paymentState === 'verifying';
  const buttonLabel =
    paymentState === 'verifying'
      ? 'Verifying payment…'
      : paymentState === 'creating_order'
        ? 'Starting secure checkout…'
        : paymentState === 'failed'
          ? 'Retry payment'
          : selectedPlan
            ? `Pay ₹${Math.round(
                (selectedPlan.recurringEnabled && selectedPlan.trialEligible !== false
                  ? selectedPlan.trialAmount ?? selectedPlan.amount
                  : selectedPlan.amount) / 100,
              )} — unlock everything`
            : 'Unlock everything';

  return (
    <Dialog open={Boolean(request) && dialogVisible} onOpenChange={(open) => !open && close()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl border-none bg-[#FBF6E8] p-0 sm:max-w-4xl"
      >
        <div className="p-6 sm:p-10">
          <button
            type="button"
            onClick={close}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> BACK
          </button>

          {plansQuery.isLoading ? (
            <div className="mt-8 space-y-4" role="status" aria-label="Loading subscription plans">
              <Skeleton className="h-10 w-2/3 rounded-lg" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
          ) : plansQuery.isError ? (
            <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm">
              <p className="font-medium">Couldn&apos;t load subscription plans.</p>
              <button
                type="button"
                className="mt-2 font-semibold text-primary underline"
                onClick={() => plansQuery.refetch()}
              >
                Try again
              </button>
            </div>
          ) : !selectedPlan ? (
            <p className="mt-8 rounded-2xl border p-6 text-sm text-muted-foreground">
              No subscription plans are available right now.
            </p>
          ) : paymentState === 'success' ? (
            <PaywallSuccess
              userName={user?.name?.split(' ')[0]}
              plan={selectedPlan}
              expiresAt={user?.subscription?.expiresAt}
              onContinue={() => onPaymentSuccess()}
            />
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
              <PaywallPricePanel
                plan={selectedPlan}
                offerDurationSeconds={PAYWALL_OFFER.offerDurationSeconds}
                claimedToday={PAYWALL_OFFER.claimedToday}
                spotsLeft={PAYWALL_OFFER.spotsLeft}
                spotsTotal={PAYWALL_OFFER.spotsTotal}
                isBusy={isBusy}
                buttonLabel={buttonLabel}
                onCheckout={startPayment}
              />

              <PaywallBenefits benefits={PAYWALL_OFFER.benefits} refundNote={PAYWALL_OFFER.refundNote} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
