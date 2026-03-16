import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { flexColumn } from 'styles/componentStyles';

const CheckoutForm = ({ returnUrl, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [elementReady, setElementReady] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);
    setMessage(null);
    setElementReady(false);

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl || `${window.location.origin}/payments/complete`,
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message);
      setLoading(false);
      return;
    }

    // Handle non-redirect flows (e.g., card payments without 3DS)
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment successful!');
      if (onSuccess) onSuccess(paymentIntent);
    } else if (paymentIntent && paymentIntent.status === 'processing') {
      setMessage('Payment is processing. You will be notified when complete.');
    } else {
      setMessage('Payment submitted. Awaiting confirmation.');
    }

    setLoading(false);
    setElementReady(true);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ ...flexColumn, gap: theme.spacing(2), maxWidth: 500 }}
    >
      <PaymentElement
        onReady={() => setElementReady(true)}
        onLoadError={(e) => {
          const msg = e?.error?.message || 'Failed to load payment form. The payment may have already been processed.';
          setError(msg);
          if (onError) onError(msg);
        }}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}

      <Button
        type="submit"
        variant="contained"
        disabled={!stripe || loading || !elementReady}
        sx={{ mt: theme.spacing(1) }}
      >
        {loading ? <CircularProgress size={24} /> : 'Complete Payment'}
      </Button>
    </Box>
  );
};

export default CheckoutForm;