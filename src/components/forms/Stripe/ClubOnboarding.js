import React, { useState, useRef, useCallback } from 'react';
import {
  Button, CircularProgress, Alert, Box, Typography,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MdLink, MdExpandMore, MdAdd } from 'react-icons/md';
import { stripeAPI } from 'api/services';
import { flexRow } from 'styles/componentStyles';

const ClubOnboarding = ({ clubId, onComplete, hasExistingAccounts = false }) => {
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

  const buttons = (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button
        variant="outlined"
        onClick={handleOnboard}
        disabled={loading || oauthLoading}
      >
        {loading ? <CircularProgress size={24} /> : (hasExistingAccounts ? 'Add New Express Account' : 'Set Up Stripe Payments')}
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1), mt: theme.spacing(1.5) }}>
        <Typography variant="body2" color="text.secondary">
          {hasExistingAccounts ? 'Already signed up to Stripe?' : 'Already have a Stripe account?'}
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={handleConnectExisting}
          disabled={loading || oauthLoading}
          startIcon={oauthLoading ? <CircularProgress size={16} /> : <MdLink size={16} />}
          sx={{ textTransform: 'none' }}
        >
          Connect your account
        </Button>
      </Box>
    </Box>
  );

  if (hasExistingAccounts) {
    return (
      <Accordion
        disableGutters
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: `${theme.spacing(1)} !important`,
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary expandIcon={<MdExpandMore />}>
          <Box sx={{ ...flexRow, alignItems: 'center', gap: theme.spacing(1) }}>
            <MdAdd size={18} color={theme.palette.text.secondary} />
            <Typography variant="body2" fontWeight="500">Add another account</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {buttons}
        </AccordionDetails>
      </Accordion>
    );
  }

  return buttons;
};

export default ClubOnboarding;