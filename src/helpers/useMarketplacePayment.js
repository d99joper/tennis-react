import { useState } from 'react';
import { stripeAPI } from 'api/services';

/**
 * Manages the Stripe PaymentIntent lifecycle for marketplace payments.
 *
 * initiatePayment(billableItemId, participantId?)
 *   - Pre-checks payment status before creating an intent
 *   - 'succeeded'  → returns { alreadyPaid: true }
 *   - 'processing' → returns { processing: true }
 *   - 'pending'    → falls through (backend reuses the same PaymentIntent)
 *   - success      → sets clientSecret / paymentId / stripeAccount, returns { success: true }
 *   - error        → returns { error: string }
 *
 * cancelPayment()
 *   - Cancels the active PaymentIntent on Stripe (best-effort) and resets local state
 *
 * reset()
 *   - Resets local state without canceling on Stripe (use after successful payment)
 */
const useMarketplacePayment = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [stripeAccount, setStripeAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (billableItemId, participantId = null) => {
    setLoading(true);
    try {
      const statusRes = await stripeAPI.getBillableItemPaymentStatus(billableItemId);
      if (statusRes.success && statusRes.data?.has_payment) {
        const status = statusRes.data.status;
        if (status === 'succeeded') return { alreadyPaid: true };
        if (status === 'processing') return { processing: true };
        // 'pending' → fall through — backend reuses the existing PaymentIntent
      }

      const res = await stripeAPI.createPaymentIntent(billableItemId, participantId);
      if (res.statusCode === 409) return { alreadyPaid: true };
      if (res.success && res.data?.client_secret) {
        setClientSecret(res.data.client_secret);
        setPaymentId(res.data.payment_id || null);
        setStripeAccount(res.data.stripe_account_id || null);
        return { success: true };
      }
      return { error: res.data?.error || 'Failed to start payment' };
    } catch (err) {
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelPayment = () => {
    if (paymentId) {
      stripeAPI.cancelPaymentIntent(paymentId).catch(() => {});
    }
    setClientSecret(null);
    setPaymentId(null);
    setStripeAccount(null);
  };

  const reset = () => {
    setClientSecret(null);
    setPaymentId(null);
    setStripeAccount(null);
  };

  return { clientSecret, paymentId, stripeAccount, loading, initiatePayment, cancelPayment, reset };
};

export default useMarketplacePayment;
