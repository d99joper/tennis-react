import React, { useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

const StripeProvider = ({ clientSecret, stripeAccount, children }) => {
  // Re-create stripePromise when stripeAccount changes
  const stripePromise = useMemo(() => {
    if (!stripePublishableKey) return null;
    return stripeAccount
      ? loadStripe(stripePublishableKey, { stripeAccount })
      : loadStripe(stripePublishableKey);
  }, [stripeAccount]);

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