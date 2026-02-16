import React, { useState, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button, CircularProgress, Alert, Box } from '@mui/material';
import { AuthContext } from 'contexts/AuthContext';
import { stripeAPI } from 'api/services';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const SubscriptionCheckout = ({ planId }) => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    const response = await stripeAPI.createSubscription(planId);

    if (!response.success) {
      setError(response.data?.error || 'Failed to start subscription.');
      setLoading(false);
      return;
    }

    // If backend returns a client_secret, we need to confirm payment
    // If it returns a session_id, redirect to Checkout
    if (response.data.session_id) {
      const stripe = await stripePromise;
      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: response.data.session_id,
      });

      if (redirectError) {
        setError(redirectError.message);
      }
    } else if (response.data.client_secret) {
      // Handle in-app subscription confirmation
      setError('In-app subscription flow not yet implemented');
    }

    setLoading(false);
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button
        variant="contained"
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Subscribe'}
      </Button>
    </Box>
  );
};

export default SubscriptionCheckout;