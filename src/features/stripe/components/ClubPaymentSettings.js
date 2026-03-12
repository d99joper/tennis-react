import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, CircularProgress, Alert, Chip,
  Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText,
  Divider, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MdExpandMore, MdPayments, MdEvent, MdGroups, MdSecurity, MdCheckCircle, MdWarning, MdHourglassTop, MdOpenInNew } from 'react-icons/md';
import { RiLockLine, RiBillLine } from 'react-icons/ri';
import { stripeAPI } from 'api/services';
import ClubOnboarding from './ClubOnboarding';
import AccountSwitcher from './AccountSwitcher';
import InfoPopup from 'shared/components/infoPopup';
import { flexColumn, flexRow } from 'styles/componentStyles';

const ClubPaymentSettings = ({ clubId }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [stripeAccount, setStripeAccount] = useState(null);
  const [error, setError] = useState(null);
  const [hasAccounts, setHasAccounts] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAccountsLoaded = useCallback((count) => {
    setHasAccounts(count > 0);
  }, []);

  const fetchStripeAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stripeAPI.getClubConnectStatus(clubId);
      if (response.success) {
        setStripeAccount(response.data);
      } else {
        setError(response.data?.error || 'Failed to fetch Stripe account status');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshTrigger(prev => prev + 1);
    }
  }, [clubId]);

  useEffect(() => {
    fetchStripeAccount();
  }, [fetchStripeAccount]);

  if (loading) {
    return (
      <Box sx={{ ...flexColumn, alignItems: 'center', p: theme.spacing(4) }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ ...flexColumn, gap: theme.spacing(3), p: theme.spacing(3) }}>
      <Box sx={{ ...flexRow, alignItems: 'center', gap: theme.spacing(1) }}>
        <Typography variant="h5">Payment Settings</Typography>
        <InfoPopup width="450px" size={22}>
          <Box sx={{ ...flexColumn, gap: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Accept Payments for Your Club
            </Typography>
            <Typography variant="body2">
              Powered by <strong>Stripe</strong> — funds go directly to your club's bank account.
            </Typography>

            <Divider />

            <Typography variant="subtitle2">What you can do:</Typography>
            <Typography variant="body2" component="div">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>Charge entry fees for tournaments, leagues, and ladders</li>
                <li>Collect membership dues from club members (coming soon)</li>
                <li>Track payments and issue refunds from your Stripe dashboard</li>
              </ul>
            </Typography>

            <Divider />

            <Typography variant="subtitle2">Security</Typography>
            <Typography variant="body2" component="div">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>MyTennis never sees or stores your banking details</li>
                <li>Stripe is PCI Level 1 certified</li>
                <li>Disconnect anytime</li>
              </ul>
            </Typography>

            <Divider />

            <Typography variant="subtitle2">Common Questions</Typography>
            <Typography variant="body2"><strong>Cost?</strong> Stripe charges ~2.9% + 30¢ per transaction. MyTennis charges a 10% platform fee.</Typography>
            <Typography variant="body2"><strong>When do I get paid?</strong> Stripe deposits within 2 business days.</Typography>
            <Typography variant="body2"><strong>Refunds?</strong> Set a refund policy per event; process refunds via Stripe dashboard.</Typography>
            <Typography variant="body2"><strong>Need a Stripe account?</strong> Create a new one or connect an existing account.</Typography>
          </Box>
        </InfoPopup>
      </Box>

      {error ? (
        <Box sx={{ ...flexColumn, gap: theme.spacing(3) }}>
          <AccountSwitcher clubId={clubId} onRefresh={fetchStripeAccount} statusError={error} onAccountsLoaded={handleAccountsLoaded} refreshTrigger={refreshTrigger} />
          <Divider />
          <ClubOnboarding clubId={clubId} onComplete={fetchStripeAccount} hasExistingAccounts />
        </Box>
      ) : stripeAccount?.connected ? (
        <ConnectedStatus
          stripeAccount={stripeAccount}
          clubId={clubId}
          theme={theme}
          onRefresh={fetchStripeAccount}
        />
      ) : (
        <Box sx={{ ...flexColumn, gap: theme.spacing(3) }}>
          {/* Main value proposition */}
          <Paper
            elevation={0}
            sx={{
              p: theme.spacing(3),
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.spacing(1.5),
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Box sx={{ ...flexRow, alignItems: 'center', gap: theme.spacing(1.5), mb: theme.spacing(2) }}>
              <MdPayments size={28} color={theme.palette.primary.main} />
              <Box>
                <Typography variant="h6">
                  Accept Payments for Your Club
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Powered by Stripe — trusted by millions of businesses worldwide
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ mb: theme.spacing(2) }}>
              Whether you're new to Stripe or already have an account, we make it easy to start
              collecting entry fees, dues, and more. Powered by <strong>Stripe</strong>, the industry
              leader in online payments — funds go directly to your club's bank account.
            </Typography>

            <Divider sx={{ my: theme.spacing(2) }} />

            {/* What you can do */}
            <Typography variant="subtitle2" sx={{ mb: theme.spacing(1) }}>
              What you can do with payments:
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <MdEvent size={18} color={theme.palette.primary.main} />
                </ListItemIcon>
                <ListItemText
                  primary="Charge entry fees for tournaments, leagues, and ladders"
                />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <MdGroups size={18} color={theme.palette.primary.main} />
                </ListItemIcon>
                <ListItemText
                  primary="Collect membership dues from club members (coming feature)"
                />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <RiBillLine size={18} color={theme.palette.primary.main} />
                </ListItemIcon>
                <ListItemText
                  primary="Track payments and issue refunds from your Stripe dashboard"
                />
              </ListItem>
            </List>
          </Paper>

          {/* Security & trust */}
          <Paper
            elevation={0}
            sx={{
              p: theme.spacing(2.5),
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.spacing(1.5),
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Box sx={{ ...flexRow, alignItems: 'center', gap: theme.spacing(1), mb: theme.spacing(1.5) }}>
              <MdSecurity size={22} color={theme.palette.success.main} />
              <Typography variant="subtitle2">Safe & Secure</Typography>
            </Box>
            <List dense disablePadding>
              {[
                'MyTennis never sees or stores your banking details — everything is handled by Stripe',
                'Stripe is PCI Level 1 certified, the highest level of security in the payments industry',
                'You can disconnect your account at any time from your Stripe dashboard',
                'Setup takes just a few minutes — you\'ll need your bank account info and basic club details',
              ].map((text, i) => (
                <ListItem key={i} disableGutters sx={{ py: 0.25, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                    <RiLockLine size={14} color={theme.palette.success.main} />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* FAQ */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: theme.spacing(1) }}>
              Common Questions
            </Typography>
            <Accordion disableGutters elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<MdExpandMore />}>
                <Typography variant="body2">How much does it cost?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Setting up a Stripe account is free. Stripe charges a small processing fee per transaction (typically 2.9% + 30¢).
                  MyTennis will charge a 10% fee on all event participation fees processed through the platform. 
                  For example, if you charge a $20 entry fee, the player pays $20, Stripe takes $0.88, 
                  MyTennis takes $2.00, and your club receives $17.12.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion disableGutters elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderTop: 0, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<MdExpandMore />}>
                <Typography variant="body2">When do I get paid?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Stripe typically deposits funds into your bank account within 2 business days.
                  You can track all payouts from your Stripe dashboard.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion disableGutters elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderTop: 0, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<MdExpandMore />}>
                <Typography variant="body2">Can I offer refunds?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Yes. You can set a refund policy when creating a paid event (full refund, partial,
                  or no refunds). Refunds are processed through your Stripe dashboard.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion disableGutters elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderTop: 0, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<MdExpandMore />}>
                <Typography variant="body2">What information do I need?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Stripe will ask for basic information about your club (name, address) and a bank
                  account for payouts. If your club is a registered organization, you may need your
                  EIN or tax ID. For individuals, a Social Security Number may be required, and you would act as a sole proprietor. 
                  The setup process will guide you through exactly what's needed based on your club's details.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion disableGutters elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderTop: 0, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<MdExpandMore />}>
                <Typography variant="body2">I already have a Stripe account — can I use it?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Yes! Use the "Connect Existing Stripe Account" option to link your existing Stripe account.
                  You'll be redirected to Stripe to authorize the connection. This is ideal if you already
                  manage payments for your club or business through Stripe. Alternatively, "Set Up New Account"
                  creates a managed account specifically for your club under MyTennis.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion disableGutters elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderTop: 0, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<MdExpandMore />}>
                <Typography variant="body2">How do I switch to a different Stripe account?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Disconnect your current account from the settings above, then reconnect with the
                  account you'd like to use. Your previous transaction history will be preserved.
                  You can reconnect with either a new Express account or an existing Standard account.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Previously disconnected — show reconnect option */}
          <AccountSwitcher clubId={clubId} onRefresh={fetchStripeAccount} onAccountsLoaded={handleAccountsLoaded} refreshTrigger={refreshTrigger} />

          {/* CTA */}
          <ClubOnboarding clubId={clubId} onComplete={fetchStripeAccount} hasExistingAccounts={hasAccounts} />
        </Box>
      )}
    </Box>
  );
};

/**
 * Renders the account status after Stripe Connect has been linked.
 * Handles multiple sub-states: pending verification, restricted, fully active.
 */
const ConnectedStatus = ({ stripeAccount, clubId, theme, onRefresh }) => {
  const {
    charges_enabled,
    payouts_enabled,
    details_submitted,
    onboarding_completed,
    can_accept_payments,
    account_id,
    dashboard_url,
    connect_type,
  } = stripeAccount;

  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  const isStandard = connect_type === 'standard';
  const isFullyActive = can_accept_payments && charges_enabled && payouts_enabled;
  const isPendingVerification = details_submitted && !charges_enabled;
  const needsMoreInfo = !details_submitted || !onboarding_completed;

  // Status chip config
  const statusConfig = isFullyActive
    ? { label: 'Active', color: 'success', icon: <MdCheckCircle /> }
    : isPendingVerification
      ? { label: 'Pending Verification', color: 'warning', icon: <MdHourglassTop /> }
      : { label: 'Action Required', color: 'error', icon: <MdWarning /> };

  // Checklist items
  const steps = [
    { label: 'Account created', done: true },
    { label: 'Details submitted', done: details_submitted },
    { label: 'Onboarding completed', done: onboarding_completed },
    { label: 'Charges enabled', done: charges_enabled },
    { label: 'Payouts enabled', done: payouts_enabled },
  ];

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const response = await stripeAPI.disconnectClubAccount(clubId);
      if (response.success) {
        setDisconnectOpen(false);
        onRefresh();
      }
    } catch (err) {
      // error handled silently, dialog stays open
    } finally {
      setDisconnecting(false);
    }
  };

  const handleResumeSetup = async () => {
    setResumeLoading(true);
    try {
      const returnUrl = `${window.location.origin}/clubs/${clubId}?tab=settings&stripe=complete`;
      const refreshUrl = `${window.location.origin}/clubs/${clubId}?tab=settings&stripe=refresh`;
      const response = await stripeAPI.refreshClubOnboardingLink(clubId, returnUrl, refreshUrl);
      if (response.success && response.data?.onboarding_url) {
        const popup = window.open(response.data.onboarding_url, 'stripe_onboarding', 'width=700,height=800');
        const timer = setInterval(() => {
          if (popup?.closed) {
            clearInterval(timer);
            onRefresh();
          }
        }, 1000);
      }
    } catch (err) {
      // error handled silently
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <Box sx={{ ...flexColumn, gap: theme.spacing(3) }}>
      {/* Status header */}
      <Paper
        elevation={0}
        sx={{
          p: theme.spacing(3),
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.spacing(1.5),
        }}
      >
        <Box sx={{ ...flexRow, alignItems: 'center', justifyContent: 'space-between', mb: theme.spacing(2) }}>
          <Box sx={{ ...flexRow, alignItems: 'center', gap: theme.spacing(1.5) }}>
            <MdPayments size={24} color={theme.palette.primary.main} />
            <Typography variant="h6">Stripe Account</Typography>
          </Box>
          <Box sx={{ ...flexRow, gap: theme.spacing(1) }}>
            {isStandard && (
              <Chip label="Standard" size="small" variant="outlined" />
            )}
            <Chip
              label={statusConfig.label}
              color={statusConfig.color}
              size="small"
              icon={statusConfig.icon}
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: theme.spacing(0.5) }}>
          Account ID: {account_id}
        </Typography>

        {/* Status message */}
        {isFullyActive && (
          <Alert severity="success" sx={{ mt: theme.spacing(2) }}>
            Your club is ready to accept payments! You can now create paid events and collect entry fees from players.
          </Alert>
        )}

        {isPendingVerification && (
          <Alert severity="warning" sx={{ mt: theme.spacing(2) }}>
            Stripe is reviewing your account details. This usually takes 1–2 business days.
            You'll be able to accept payments once verification is complete.
          </Alert>
        )}

        {needsMoreInfo && !isStandard && (
          <Alert severity="error" sx={{ mt: theme.spacing(2) }}>
            Your account setup isn't complete yet. Stripe needs additional information before
            you can start accepting payments. Click "Continue Setup" below to finish.
          </Alert>
        )}
      </Paper>

      {/* Setup progress — only shown for Express accounts that aren't fully active */}
      {!isStandard && !isFullyActive && (
        <Paper
          elevation={0}
          sx={{
            p: theme.spacing(3),
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.spacing(1.5),
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: theme.spacing(1.5) }}>
            Setup Progress
          </Typography>
          <List dense disablePadding>
            {steps.map((step, i) => (
              <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {step.done
                    ? <MdCheckCircle size={18} color={theme.palette.success.main} />
                    : <MdHourglassTop size={18} color={theme.palette.text.disabled} />
                  }
                </ListItemIcon>
                <ListItemText
                  primary={step.label}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: step.done ? 'text.primary' : 'text.disabled',
                    sx: step.done ? { textDecoration: 'line-through' } : undefined,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Account Switcher */}
      <AccountSwitcher clubId={clubId} onRefresh={onRefresh} />

      {/* Actions */}
      <Box sx={{ ...flexRow, gap: theme.spacing(2), flexWrap: 'wrap' }}>
        {needsMoreInfo && !isStandard && (
          <Button
            variant="contained"
            onClick={handleResumeSetup}
            disabled={resumeLoading}
            startIcon={resumeLoading ? <CircularProgress size={16} /> : null}
          >
            Continue Setup
          </Button>
        )}

        {isPendingVerification && (
          <Button variant="outlined" onClick={onRefresh}>
            Check Status
          </Button>
        )}

        {dashboard_url && (
          <Button
            variant={isFullyActive ? 'contained' : 'outlined'}
            href={dashboard_url}
            target="_blank"
            endIcon={<MdOpenInNew size={16} />}
          >
            Stripe Dashboard
          </Button>
        )}

        <Button
          variant="outlined"
          color="error"
          onClick={() => setDisconnectOpen(true)}
        >
          Disconnect
        </Button>
      </Box>

      {/* Disconnect confirmation dialog */}
      <Dialog
        open={disconnectOpen}
        onClose={() => !disconnecting && setDisconnectOpen(false)}
      >
        <DialogTitle>Disconnect Stripe Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will disconnect your Stripe account from your club. You won't be able to
            accept payments until you reconnect. Your transaction history will be preserved
            for your records.
          </DialogContentText>
          {isStandard && (
            <DialogContentText sx={{ mt: 1 }}>
              Your Stripe account itself won't be affected — only the link to MyTennis
              will be removed. You can reconnect or link a different account at any time.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDisconnectOpen(false)}
            disabled={disconnecting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDisconnect}
            color="error"
            variant="contained"
            disabled={disconnecting}
            startIcon={disconnecting ? <CircularProgress size={16} /> : null}
          >
            {disconnecting ? 'Disconnecting...' : 'Disconnect'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClubPaymentSettings;
