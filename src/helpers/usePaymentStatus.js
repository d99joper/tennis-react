import { useState, useEffect, useCallback } from 'react';
import { stripeAPI } from 'api/services';

/**
 * Polls backend for payment status after Stripe confirmation.
 * Stops polling when status is 'succeeded', 'failed', or max attempts reached.
 *
 * @param {string|null} paymentId - Marketplace payment ID
 * @param {object} options - { intervalMs: 2000, maxAttempts: 15 }
 * @returns {{ status, loading, error }}
 */
const usePaymentStatus = (paymentId, options = {}) => {
  const { intervalMs = 2000, maxAttempts = 15 } = options;

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(!!paymentId);
  const [error, setError] = useState(null);

  const poll = useCallback(async () => {
    if (!paymentId) {
      setLoading(false);
      return;
    }

    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;

      const response = await stripeAPI.getPaymentStatus(paymentId);

      if (!response.success) {
        setError(response.data?.error || 'Failed to fetch payment status.');
        clearInterval(interval);
        setLoading(false);
        return;
      }

      const currentStatus = response.data.status;
      setStatus(currentStatus);

      if (currentStatus === 'succeeded' || currentStatus === 'failed' || attempts >= maxAttempts) {
        clearInterval(interval);
        setLoading(false);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [paymentId, intervalMs, maxAttempts]);

  useEffect(() => {
    const cleanup = poll();
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [poll]);

  return { status, loading, error };
};

export default usePaymentStatus;