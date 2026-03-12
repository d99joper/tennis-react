import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AuthContext } from 'contexts/AuthContext';
import { stripeAPI } from 'api/services';
import StripeProvider from 'features/stripe/components/StripeProvider';
import CheckoutForm from 'features/stripe/components/CheckoutForm';
import { flexColumn } from 'styles/componentStyles';

const MarketplaceCheckout = () => {
  const { billableItemId } = useParams();
  const location = useLocation();
  const { user, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const [clientSecret, setClientSecret] = useState(null);
  const [marketplacePaymentId, setMarketplacePaymentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get participant_id from location state if available
  const participantId = location.state?.participantId;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    async function initPayment() {
      setLoading(true);
      setError(null);

      const response = await stripeAPI.createPaymentIntent(billableItemId);

      if (!response.success) {
        setError(response.data?.error || 'Failed to initialize payment.');
        setLoading(false);
        return;
      }

      setClientSecret(response.data.client_secret);
      setMarketplacePaymentId(response.data.payment_id);
      setLoading(false);
    }

    initPayment();
  }, [billableItemId, participantId, isLoggedIn, user, navigate]);

  const handleSuccess = (paymentIntent) => {
    // Optionally poll backend for webhook-confirmed status
    navigate(`/payments/complete?payment_id=${marketplacePaymentId}`);
  };

  if (loading) {
    return (
      <Box sx={{ ...flexColumn, alignItems: 'center', mt: theme.spacing(8) }}>
        <CircularProgress />
        <Typography sx={{ mt: theme.spacing(2) }}>Preparing checkout…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: theme.spacing(4) }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: theme.spacing(3) }}>
      <Typography variant="h5" gutterBottom>
        Complete Payment
      </Typography>

      <StripeProvider clientSecret={clientSecret}>
        <CheckoutForm 
          onSuccess={handleSuccess}
          returnUrl={`${window.location.origin}/payments/complete?payment_id=${marketplacePaymentId}`}
        />
      </StripeProvider>
    </Box>
  );
};

export default MarketplaceCheckout;