import React, { useContext } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AuthContext } from 'contexts/AuthContext';
import usePaymentStatus from 'helpers/usePaymentStatus';
import { flexColumn } from 'styles/componentStyles';

const PaymentComplete = () => {
  const theme = useTheme();
  const { isLoggedIn } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  // Marketplace payment (legacy) — payment_id param
  const paymentId = searchParams.get('payment_id');

  // Subscription payment — Stripe sends redirect_status + payment_intent
  const redirectStatus = searchParams.get('redirect_status');
  const isSubscriptionReturn = !!redirectStatus && !paymentId;

  const { status, loading, error } = usePaymentStatus(paymentId);

  if (!isLoggedIn) {
    return (
      <Box sx={{ ...flexColumn, alignItems: 'center', mt: theme.spacing(8), gap: theme.spacing(2) }}>
        <Alert severity="warning">Please log in to view payment status.</Alert>
        <Button variant="contained" component={RouterLink} to="/login">
          Log In
        </Button>
      </Box>
    );
  }

  // Subscription return — status is determined directly from redirect_status
  if (isSubscriptionReturn) {
    return (
      <Box sx={{ ...flexColumn, alignItems: 'center', mt: theme.spacing(8), gap: theme.spacing(2), p: theme.spacing(3) }}>
        <Typography variant="h5">Subscription Payment</Typography>
        {redirectStatus === 'succeeded' ? (
          <>
            <Alert severity="success">Payment successful! Your subscription is now active.</Alert>
            <Typography variant="body2" color="text.secondary">
              It may take a moment for your account to update. Visit your subscription page to confirm.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" component={RouterLink} to="/subscription">
                View Subscription
              </Button>
              <Button variant="outlined" component={RouterLink} to="/">
                Go Home
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Alert severity="error">
              Payment {redirectStatus === 'failed' ? 'failed' : `was not completed (${redirectStatus})`}.
              Please try again.
            </Alert>
            <Button variant="contained" component={RouterLink} to="/subscription">
              Back to Plans
            </Button>
          </>
        )}
      </Box>
    );
  }

  // Marketplace payment (legacy polling flow)
  return (
    <Box sx={{ ...flexColumn, alignItems: 'center', mt: theme.spacing(8), gap: theme.spacing(2), p: theme.spacing(3) }}>
      <Typography variant="h5">Payment Status</Typography>

      {loading && (
        <>
          <CircularProgress />
          <Typography>Confirming your payment…</Typography>
        </>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {status === 'succeeded' && (
        <>
          <Alert severity="success">Payment completed successfully!</Alert>
          <Typography variant="body2" color="text.secondary">
            Your registration is confirmed. Check your email for details.
          </Typography>
          <Button variant="contained" component={RouterLink} to="/">
            Return Home
          </Button>
        </>
      )}

      {status === 'failed' && (
        <>
          <Alert severity="error">Payment failed. Please try again or contact support.</Alert>
          <Button variant="contained" component={RouterLink} to="/">
            Return Home
          </Button>
        </>
      )}

      {status && status !== 'succeeded' && status !== 'failed' && !loading && (
        <Alert severity="info">Payment status: {status}</Alert>
      )}
    </Box>
  );
};

export default PaymentComplete;