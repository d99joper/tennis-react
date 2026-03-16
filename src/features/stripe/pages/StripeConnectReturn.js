import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MdCheckCircle } from 'react-icons/md';
import { flexColumn } from 'styles/componentStyles';

const StripeConnectReturn = () => {
  const theme = useTheme();

  const handleClose = () => {
    window.close();
  };

  return (
    <Box
      sx={{
        ...flexColumn,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: theme.spacing(3),
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          ...flexColumn,
          alignItems: 'center',
          gap: theme.spacing(2),
          p: theme.spacing(5),
          maxWidth: 420,
          borderRadius: theme.spacing(2),
          textAlign: 'center',
        }}
      >
        <MdCheckCircle size={56} color={theme.palette.success.main} />
        <Typography variant="h5" fontWeight={600}>
          Account Setup Complete
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your Stripe account has been successfully connected. Stripe may take a few
          business days to validate your account. Once validated, you can accept payments
          for your club's events and memberships.
        </Typography>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{ mt: theme.spacing(1) }}
        >
          Close This Window
        </Button>
      </Paper>
    </Box>
  );
};

export default StripeConnectReturn;
