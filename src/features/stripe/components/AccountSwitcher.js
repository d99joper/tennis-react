import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, List, Chip, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Paper, Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MdCheckCircle, MdSwapHoriz, MdAccountBalance, MdWarning, MdDeleteOutline, MdRefresh, MdOpenInNew, MdHourglassTop } from 'react-icons/md';
import { stripeAPI } from 'api/services';
import { flexColumn, flexRow } from 'styles/componentStyles';
import { useSnackbar } from 'contexts/snackbarContext';


const AccountSwitcher = ({ clubId, onRefresh, statusError, onAccountsLoaded, refreshTrigger }) => {


    // Handler for switching accounts
    const handleSwitchClick = (account) => {
      setSelectedAccount(account);
      setConfirmOpen(true);
    };

    // Handler for removing accounts
    const handleRemoveClick = (account) => {
      setSelectedAccount(account);
      setRemoveConfirmOpen(true);
    };

    // Handler for confirming switch
    const handleConfirmSwitch = async () => {
      if (!selectedAccount) return;
      setSwitchingTo(selectedAccount.id);
      try {
        const response = await stripeAPI.switchClubAccount(clubId, selectedAccount.stripe_account_id);
        if (response.success) {
          showSnackbar('Account switched successfully', 'success');
          setConfirmOpen(false);
          onRefresh();
        } else {
          showSnackbar(response.data?.error || 'Failed to switch account', 'error');
        }
      } catch (err) {
        showSnackbar(err.message, 'error');
      } finally {
        setSwitchingTo(null);
      }
    };

    // Handler for confirming remove
    const handleConfirmRemove = async () => {
      if (!selectedAccount) return;
      setRemovingId(selectedAccount.id);
      try {
        const response = await stripeAPI.deleteClubAccount(clubId, selectedAccount.stripe_account_id);
        if (response.success) {
          showSnackbar('Account removed successfully', 'success');
          setRemoveConfirmOpen(false);
          onRefresh();
        } else {
          showSnackbar(response.data?.error || 'Failed to remove account', 'error');
        }
      } catch (err) {
        showSnackbar(err.message, 'error');
      } finally {
        setRemovingId(null);
      }
    };
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const [onboardingLoadingId, setOnboardingLoadingId] = useState(null);

  // Open onboarding link for a specific account
  const handleContinueSetup = async (account) => {
    setOnboardingLoadingId(account.id);
    try {
      const returnUrl = `${window.location.origin}/clubs/${clubId}?tab=settings&stripe=complete`;
      const refreshUrl = `${window.location.origin}/clubs/${clubId}?tab=settings&stripe=refresh`;
      const response = await stripeAPI.refreshClubOnboardingLink(clubId, returnUrl, refreshUrl, account.stripe_account_id);
      if (response.success && response.data?.url) {
        const popup = window.open(response.data.url, 'stripe_onboarding', 'width=700,height=800');
        const timer = setInterval(() => {
          if (popup?.closed) {
            clearInterval(timer);
            onRefresh();
          }
        }, 1000);
      } else {
        showSnackbar(response.data?.error || 'Failed to get onboarding link', 'error');
      }
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setOnboardingLoadingId(null);
    }
  };

  const [accounts, setAccounts] = useState([]);
  const [switchingTo, setSwitchingTo] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  // ...existing code...
    // Find the active and inactive accounts (after accounts state is defined)
    const activeAccount = accounts.find((a) => a.is_active);
    const inactiveAccounts = accounts.filter((a) => !a.is_active);
  const [showErrorDetail, setShowErrorDetail] = useState(false);

  const fetchAccounts = useCallback(async () => {
    // ...existing code...
    try {
      const response = await stripeAPI.listClubAccounts(clubId);
      if (response.success) {
        const data = response.data;
        const accountList = Array.isArray(data) ? data : data?.accounts || [];
        setAccounts(accountList);
        if (onAccountsLoaded) onAccountsLoaded(accountList.length);
      }
    } catch (err) {
      // ...existing code...
    } finally {
      // ...existing code...
    }
  }, [clubId, onAccountsLoaded]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts, refreshTrigger]);

  const isIncomplete = (account) => !account.onboarding_completed || !account.details_submitted;
  // ...existing code...

  // If no status error and no inactive accounts, nothing to show
  if (!statusError && inactiveAccounts.length === 0) {
    return null;
  }

  const isReconnect = !activeAccount;
  const hasActiveError = statusError && activeAccount;

  return (
    <Box sx={{ ...flexColumn, gap: theme.spacing(2) }}>
      <Box sx={{ ...flexRow, alignItems: 'center', gap: theme.spacing(1) }}>
        <MdSwapHoriz size={20} color={theme.palette.text.secondary} />
        <Typography variant="subtitle2" color="text.secondary">
          {isReconnect ? 'Previous Accounts' : 'Connected Accounts'}
        </Typography>
      </Box>

      {/* ...existing code... */}

      <List disablePadding sx={{ ...flexColumn, gap: theme.spacing(1.5) }}>
        {/* Active Account */}
        {activeAccount && (
          <>
            <Divider sx={{ my: theme.spacing(0.5) }}>
              <Typography variant="caption" color="text.disabled">
                Connected Account
              </Typography>
            </Divider>
            <Paper
              elevation={0}
              sx={{
                border: `2px solid ${hasActiveError ? theme.palette.error.main : theme.palette.success.main}`,
                borderRadius: theme.spacing(1),
                p: theme.spacing(2),
                backgroundColor: hasActiveError
                  ? theme.palette.error.lighter || theme.palette.background.paper
                  : theme.palette.success.lighter || theme.palette.background.paper,
              }}
            >
              <Box sx={{ ...flexColumn, gap: theme.spacing(1) }}>
                <Box sx={{ ...flexRow, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ ...flexColumn, gap: theme.spacing(0.5), flex: 1 }}>
                    <Box sx={{ ...flexRow, alignItems: 'center', gap: theme.spacing(1), flexWrap: 'wrap' }}>
                      <Typography variant="body2" fontWeight="600">
                        {activeAccount.account_name || activeAccount.account_email || 'Stripe Account'}
                      </Typography>
                      <Chip
                        label={hasActiveError ? 'Error' : 'Active'}
                        size="small"
                        color={hasActiveError ? 'error' : 'success'}
                        icon={hasActiveError ? <MdWarning /> : <MdCheckCircle />}
                        sx={{ height: 20, ...(hasActiveError && { cursor: 'pointer' }) }}
                        {...(hasActiveError && { onClick: () => setShowErrorDetail(prev => !prev) })}
                      />
                      <Chip
                        label={activeAccount.connect_type === 'standard' ? 'Standard' : 'Express'}
                        size="small"
                        color={activeAccount.connect_type === 'standard' ? 'secondary' : 'primary'}
                        sx={{ height: 20 }}
                      />
                    </Box>
                    {activeAccount.account_email && activeAccount.account_name && (
                      <Typography variant="caption" color="text.secondary">
                        {activeAccount.account_email}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {activeAccount.stripe_account_id}
                      {activeAccount.connected_at && (
                        <> &bull; Connected {new Date(activeAccount.connected_at).toLocaleDateString()}</>
                      )}
                    </Typography>
                    {hasActiveError && showErrorDetail && (
                      <Typography variant="caption" color="error" sx={{ mt: theme.spacing(0.5) }}>
                        {statusError}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {hasActiveError && (
                  <Box sx={{ ...flexRow, gap: theme.spacing(1), flexWrap: 'wrap', mt: theme.spacing(0.5) }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={onRefresh}
                      startIcon={<MdRefresh size={16} />}
                    >
                      Refresh Status
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      href={`https://dashboard.stripe.com/${activeAccount.connect_type === 'express' ? 'express/' : ''}${activeAccount.stripe_account_id}`}
                      target="_blank"
                      endIcon={<MdOpenInNew size={14} />}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleRemoveClick(activeAccount)}
                      disabled={removingId !== null}
                      startIcon={removingId === activeAccount.id ? <CircularProgress size={14} /> : <MdDeleteOutline size={16} />}
                    >
                      {removingId === activeAccount.id ? 'Removing...' : 'Remove'}
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </>
        )}

        {/* Inactive Accounts */}
        {inactiveAccounts.length > 0 && (
          <>
            {activeAccount && (
              <Divider sx={{ my: theme.spacing(0.5) }}>
                <Typography variant="caption" color="text.disabled">
                  Other Accounts
                </Typography>
              </Divider>
            )}
            {inactiveAccounts.map((account) => {
              const incomplete = isIncomplete(account);
              return (
                <Paper
                  key={account.id}
                  elevation={0}
                  sx={{
                    border: `1px solid ${incomplete ? theme.palette.warning.light : theme.palette.divider}`,
                    borderRadius: theme.spacing(1),
                    p: theme.spacing(2),
                  }}
                >
                  <Box sx={{ ...flexColumn, gap: theme.spacing(1) }}>
                    <Box sx={{ ...flexRow, justifyContent: 'space-between', alignItems: 'flex-start', gap: theme.spacing(2) }}>
                      <Box sx={{ ...flexColumn, gap: theme.spacing(0.5), flex: 1 }}>
                        <Box sx={{ ...flexRow, alignItems: 'center', gap: theme.spacing(1), flexWrap: 'wrap' }}>
                          <Typography variant="body2" fontWeight="500">
                            {account.account_name || account.account_email || 'Stripe Account'}
                          </Typography>
                          <Chip
                            label={account.connect_type === 'standard' ? 'Standard' : 'Express'}
                            size="small"
                            color={account.connect_type === 'standard' ? 'secondary' : 'primary'}
                            variant="outlined"
                            sx={{ height: 20 }}
                          />
                          {incomplete && (
                            <Chip
                              label="Setup Incomplete"
                              size="small"
                              color="warning"
                              icon={<MdWarning />}
                              variant="outlined"
                              sx={{ height: 20 }}
                            />
                          )}
                        </Box>
                        {account.account_email && account.account_name && (
                          <Typography variant="caption" color="text.secondary">
                            {account.account_email}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Connected {new Date(account.connected_at).toLocaleDateString()}
                          {account.disconnected_at && (
                            <> &bull; Disconnected {new Date(account.disconnected_at).toLocaleDateString()}</>
                          )}
                        </Typography>
                      </Box>
                      <Box sx={{ ...flexRow, gap: theme.spacing(1) }}>
                        {!incomplete && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleSwitchClick(account)}
                            disabled={switchingTo !== null || removingId !== null}
                            startIcon={switchingTo === account.id ? <CircularProgress size={14} /> : <MdAccountBalance size={16} />}
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            {switchingTo === account.id
                              ? 'Setting as Primary...'
                              : 'Set as Primary'}
                          </Button>
                        )}
                        {incomplete && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => handleContinueSetup(account)}
                            disabled={onboardingLoadingId === account.id || removingId !== null}
                            startIcon={onboardingLoadingId === account.id ? <CircularProgress size={14} /> : <MdHourglassTop size={16} />}
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            {onboardingLoadingId === account.id ? 'Opening...' : 'Continue Setup'}
                          </Button>
                        )}
                        {incomplete && (
                          <Button
                            variant="outlined"
                            size="small"
                            href={`https://dashboard.stripe.com/${account.connect_type === 'express' ? 'express/' : ''}${account.stripe_account_id}`}
                            target="_blank"
                            endIcon={<MdOpenInNew size={14} />}
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            Dashboard
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleRemoveClick(account)}
                          disabled={switchingTo !== null || removingId !== null}
                          startIcon={removingId === account.id ? <CircularProgress size={14} /> : <MdDeleteOutline size={16} />}
                          sx={{ whiteSpace: 'nowrap' }}
                        >
                          {removingId === account.id ? 'Removing...' : 'Remove'}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </>
        )}
      </List>

      {/* Switch Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isReconnect ? 'Reconnect Stripe Account?' : 'Switch Stripe Account?'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isReconnect ? 'You are about to reconnect:' : 'You are about to switch to:'}
          </DialogContentText>
          {selectedAccount && (
            <Box sx={{ ...flexColumn, gap: theme.spacing(0.5), my: theme.spacing(2), p: theme.spacing(2), backgroundColor: theme.palette.background.default, borderRadius: theme.spacing(1) }}>
              <Typography variant="body2" fontWeight="600">
                {selectedAccount.account_name || selectedAccount.account_email}
              </Typography>
              {selectedAccount.account_email && selectedAccount.account_name && (
                <Typography variant="caption" color="text.secondary">
                  {selectedAccount.account_email}
                </Typography>
              )}
              <Box sx={{ ...flexRow, gap: theme.spacing(1), mt: theme.spacing(0.5) }}>
                <Chip
                  label={selectedAccount.connect_type === 'standard' ? 'Standard' : 'Express'}
                  size="small"
                  color={selectedAccount.connect_type === 'standard' ? 'secondary' : 'primary'}
                />
              </Box>
            </Box>
          )}
          <DialogContentText>
            {isReconnect
              ? 'This account will be reactivated and your club will be able to accept payments again.'
              : 'Your current account will be deactivated, but you can switch back at any time. Future payments will use this account.'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSwitch}
            variant="contained"
            color="primary"
          >
            {isReconnect ? 'Reconnect' : 'Confirm Switch'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Confirmation Dialog */}
      <Dialog
        open={removeConfirmOpen}
        onClose={() => setRemoveConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Remove Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove this account record from your club. This action cannot be undone.
          </DialogContentText>
          {selectedAccount && (
            <Box sx={{ ...flexColumn, gap: theme.spacing(0.5), my: theme.spacing(2), p: theme.spacing(2), backgroundColor: theme.palette.background.default, borderRadius: theme.spacing(1) }}>
              <Typography variant="body2" fontWeight="600">
                {selectedAccount.account_name || selectedAccount.account_email || 'Stripe Account'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedAccount.stripe_account_id}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemove}
            variant="contained"
            color="error"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountSwitcher;
