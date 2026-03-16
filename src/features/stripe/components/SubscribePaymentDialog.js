import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Alert, CircularProgress, Box
} from '@mui/material';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ planName, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payments/complete`,
      },
    });

    // confirmPayment only returns an error if the redirect did not happen
    if (confirmError) {
      setError(confirmError.message);
      setSubmitting(false);
    }
    // On success Stripe redirects to return_url — no code runs after that
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <PaymentElement />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <DialogActions sx={{ px: 0, pt: 3 }}>
        <Button onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting || !stripe || !elements}
        >
          {submitting ? <CircularProgress size={20} /> : `Subscribe to ${planName}`}
        </Button>
      </DialogActions>
    </Box>
  );
};

/**
 * Dialog that mounts a Stripe PaymentElement to collect payment details,
 * then confirms the PaymentIntent using the provided clientSecret.
 */
const SubscribePaymentDialog = ({ open, onClose, clientSecret, planName }) => {
  if (!open || !clientSecret) return null;

  const options = {
    clientSecret,
    appearance: { theme: 'stripe' },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Complete Your Subscription</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter your payment details to subscribe to the <strong>{planName}</strong> plan.
        </Typography>
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm planName={planName} onCancel={onClose} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribePaymentDialog;
