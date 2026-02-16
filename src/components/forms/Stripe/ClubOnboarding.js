import React, { useState, useRef, useCallback } from 'react';
import { Button, CircularProgress, Alert, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MdLink } from 'react-icons/md';
import { stripeAPI } from 'api/services';

const ClubOnboarding = ({ clubId, onComplete }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);
  const timerRef = useRef(null);

  const watchPopup = useCallback(() => {
    timerRef.current = setInterval(() => {
      if (!popupRef.current || popupRef.current.closed) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        popupRef.current = null;
        // Popup was closed — refresh the Connect status
        if (onComplete) onComplete();
      }
    }, 500);
  }, [onComplete]);

  const handleOnboard = async () => {
    setLoading(true);
    setError(null);

    const response = await stripeAPI.createClubConnectAccount(clubId);

    if (!response.success) {
      setError(response.data?.error || 'Failed to start onboarding.');
      setLoading(false);
      return;
    }

    // Open Stripe onboarding in a centered popup
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    popupRef.current = window.open(
      response.data.onboarding_url,
      'stripe-onboarding',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
    );

    watchPopup();
    setLoading(false);
  };

  const handleConnectExisting = async () => {
    setOauthLoading(true);
    setError(null);

    const response = await stripeAPI.getOAuthLink(clubId);

    if (!response.success) {
      setError(response.data?.error || 'Failed to generate connect link.');
      setOauthLoading(false);
      return;
    }

    // Redirect user to Stripe OAuth page
    window.location.href = response.data.oauth_url;
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button
        variant="outlined"
        onClick={handleOnboard}
        disabled={loading || oauthLoading}
      >
        {loading ? <CircularProgress size={24} /> : 'Set Up Stripe Payments'}
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1), mt: theme.spacing(1.5) }}>
        <Typography variant="body2" color="text.secondary">
          Already have a Stripe account?
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={handleConnectExisting}
          disabled={loading || oauthLoading}
          startIcon={oauthLoading ? <CircularProgress size={16} /> : <MdLink size={16} />}
          sx={{ textTransform: 'none' }}
        >
          Connect existing account
        </Button>
      </Box>
    </Box>
  );
};

export default ClubOnboarding;