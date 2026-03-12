import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { stripeAPI } from 'api/services';
import { flexColumn } from 'styles/componentStyles';

const StripeOAuthCallback = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const calledRef = useRef(false);

  const code = searchParams.get('code');
  const clubId = searchParams.get('state');

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const exchangeCode = async () => {
      if (!code || !clubId) {
        setError('Missing authorization code or club information. Please try again.');
        setLoading(false);
        return;
      }

      try {
        const response = await stripeAPI.completeOAuthCallback(clubId, code);
        if (response.success) {
          setSuccess(true);
        } else {
          setError(response.data?.error || 'Failed to connect your Stripe account. Please try again.');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    exchangeCode();
  }, [code, clubId]);

  const handleGoToClub = () => {
    navigate(`/clubs/${clubId}?tab=admin`);
  };

  return (
    <Box
      sx={{
        ...flexColumn,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        p: theme.spacing(3),
      }}
    >
      <Paper
        elevation={2}
        sx={{
          ...flexColumn,
          alignItems: 'center',
          gap: theme.spacing(2),
          p: theme.spacing(5),
          maxWidth: 460,
          borderRadius: theme.spacing(2),
          textAlign: 'center',
        }}
      >
        {loading && (
          <>
            <CircularProgress size={48} />
            <Typography variant="h6">
              Connecting your Stripe account...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we finalize the connection.
            </Typography>
          </>
        )}

        {success && (
          <>
            <MdCheckCircle size={56} color={theme.palette.success.main} />
            <Typography variant="h5" fontWeight={600}>
              Account Connected!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your existing Stripe account has been successfully connected to your club.
              You can now accept payments for events and memberships.
            </Typography>
            <Button
              variant="contained"
              onClick={handleGoToClub}
              sx={{ mt: theme.spacing(1) }}
            >
              Go to Club Settings
            </Button>
          </>
        )}

        {error && (
          <>
            <MdError size={56} color={theme.palette.error.main} />
            <Typography variant="h5" fontWeight={600}>
              Connection Failed
            </Typography>
            <Alert severity="error" sx={{ textAlign: 'left' }}>
              {error}
            </Alert>
            {clubId && (
              <Button
                variant="outlined"
                onClick={handleGoToClub}
                sx={{ mt: theme.spacing(1) }}
              >
                Back to Club Settings
              </Button>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default StripeOAuthCallback;
