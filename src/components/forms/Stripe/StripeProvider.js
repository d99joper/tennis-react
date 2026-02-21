import React, { useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// loadStripe is safe to call at module level — it returns a Promise and only
// initialises once. Guard against missing env var to avoid the "undefined key" error.
const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const StripeProvider = ({ clientSecret, children }) => {
  const options = useMemo(() => ({
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#4caf50',
      },
    },
  }), [clientSecret]);

  if (!stripePromise || !clientSecret) return null;

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;