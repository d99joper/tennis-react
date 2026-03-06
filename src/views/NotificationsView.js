import React, { useState, useContext, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText, Divider,
  IconButton, Grid, Button, LinearProgress, Alert, Chip, CircularProgress,
} from '@mui/material';
import { AiOutlineMail, AiOutlineCheck, AiOutlineDelete, AiOutlineMessage } from 'react-icons/ai';
import { useNotificationsContext } from 'contexts/NotificationContext';
import { Link } from 'react-router-dom';
import notificationAPI from 'api/services/notifications';
import requestAPI from 'api/services/request';
import { stripeAPI, billableItemAPI, eventAPI, divisionAPI } from 'api/services';
import { ProfileImage } from 'components/forms';
import { useSnackbar } from 'contexts/snackbarContext';
import { Helmet } from 'react-helmet-async';
import MyModal from 'components/layout/MyModal';
import Conversation from 'components/forms/Conversations/conversations';
import { AuthContext } from 'contexts/AuthContext';
import StripeProvider from 'components/forms/Stripe/StripeProvider';
import CheckoutForm from 'components/forms/Stripe/CheckoutForm';
import { displayRefundPolicy } from 'helpers';

const NotificationsView = () => {
  const [loading, setLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [eventBillableItem, setEventBillableItem] = useState(null);
  const [paymentClientSecret, setPaymentClientSecret] = useState(null);
  const [paymentStripeAccount, setPaymentStripeAccount] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const paymentDone =
    selectedNotification?.type === 'payment_required' &&
    (selectedNotification?.status === 'paid' || paymentStatus === 'succeeded');

  const { notifications, notificationCount, markAsRead, deleteNotification, updateNotification } = useNotificationsContext();
  //const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { showSnackbar } = useSnackbar();
  const { user, isLoggedIn } = useContext(AuthContext);

  const loadPaymentRequiredData = async (notification) => {
    const billableItemId = notification?.related_object?.id;
    if (!billableItemId) {
      setPaymentStatus('unpaid');
      return;
    }
    setPaymentStatus('checking');
    try {
      const [billableRes, statusRes] = await Promise.all([
        billableItemAPI.getBillableItem(billableItemId),
        stripeAPI.getBillableItemPaymentStatus(billableItemId),
      ]);
      if (billableRes.success) {
        const item = billableRes.data?.id ? billableRes.data : (billableRes.data?.data ?? billableRes.data);
        setEventBillableItem(item);
      }
      if (statusRes.success) {
        if (!statusRes.data?.has_payment) {
          setPaymentStatus('unpaid');
          return;
        }
        const status = statusRes.data.status;
        setPaymentStatus(status);
        if (status === 'succeeded') {
          const updated = { ...notification, status: 'paid' };
          updateNotification(updated);
          setSelectedNotification(updated);
        }
      } else {
        setPaymentStatus('pending');
      }
    } catch (err) {
      setPaymentStatus('unpaid');
      showSnackbar(err.message || 'Failed to check payment status', 'error');
    }
  };

  const handleSelectNotification = async (notification) => {
    if (selectedNotification?.id !== notification.id) {
      // Mark previous as read
      if (selectedNotification && !selectedNotification.is_read) {
        markAsRead(selectedNotification.id, true);
      }
      // Reset payment state immediately
      setPaymentClientSecret(null);
      setPaymentStripeAccount(null);
      setEventBillableItem(null);
      setPaymentStatus(null);
      setLoading(true);
      try {
        setSelectedNotification(notification);
        const details = await notificationAPI.getNotification(notification.id);
        // Merge locally-updated status (e.g. 'paid') so it isn't lost when
        // the API response comes back with the pre-webhook status.
        const contextNotif = notifications.find(n => String(n.id) === String(notification.id));
        const merged = { ...details, status: contextNotif?.status || details.status };
        setSelectedNotification(merged);

        if (merged.type === 'payment_required') {
          if (merged.status === 'paid') {
            setPaymentStatus('succeeded');
          } else {
            // Don't await — let the payment section show its own spinner
            loadPaymentRequiredData(merged);
          }
        } else if (merged.type === 'join_request') {
          const eventId = merged.related_object?.id;
          if (eventId) {
            billableItemAPI.getEventBillableItems(eventId).then((res) => {
              if (res.success) {
                const items = Array.isArray(res.data) ? res.data
                  : Array.isArray(res.data?.results) ? res.data.results
                  : [];
                // Prefer the division-specific fee when the request targets a division
                const divisionItem = merged.division_id
                  ? items.find((i) => i.target_type === 'division' && i.target_id === merged.division_id)
                  : null;
                const eventItem = items.find((i) => i.target_type === 'event' || !i.target_type);
                setEventBillableItem(divisionItem || eventItem || null);
              }
            });
          }
        }
      } catch (e) {
        console.log('failed to get notification');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAction = async (approve) => {
    try {
      const response = await requestAPI.processRequest(selectedNotification.id, approve)
      if (!response.success) {
        showSnackbar(response.message || 'Failed to process the request', 'error');
        return;
      }
      const newStatus = approve ? 'approved' : 'denied';
      updateNotification({ ...selectedNotification, status: newStatus });
      setSelectedNotification({ ...selectedNotification, status: newStatus });
      showSnackbar(response.data?.message || (approve ? 'Request approved' : 'Request denied'), 'success');
    }
    catch (e) {
      showSnackbar('Failed to process the request', 'error');
    }
  }

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

  const handlePayNow = async () => {
    const billableItemId = selectedNotification?.related_object?.id;
    if (!billableItemId) return;
    // Double-check server-side before creating a new payment intent
    setPaymentLoading(true);
    try {
      const statusRes = await stripeAPI.getBillableItemPaymentStatus(billableItemId);
      if (statusRes.success && statusRes.data?.has_payment) {
        const status = statusRes.data.status;
        setPaymentStatus(status);
        if (status === 'succeeded') {
          const updated = { ...selectedNotification, status: 'paid' };
          updateNotification(updated);
          setSelectedNotification(updated);
          showSnackbar('This entry fee has already been paid.', 'info');
          return;
        }
        if (status === 'pending') {
          showSnackbar('Your payment is still processing. Please wait.', 'info');
          return;
        }
        // failed / refunded — fall through and allow retry
      }
      const res = await stripeAPI.createPaymentIntent(billableItemId);
      if (res.success && res.data?.client_secret) {
        setPaymentClientSecret(res.data.client_secret);
        setPaymentStripeAccount(res.data.stripe_account_id || null);
      } else {
        showSnackbar(res.data?.error || 'Failed to initiate payment. Please try again.', 'error');
      }
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Helmet>
        <title>Messages | MyTennis Space</title>
      </Helmet>
      {/* Notification Lists */}
      <Grid size={{ xs: 4 }}>
        <Box p={2} borderRight="1px solid #ccc" sx={{ overflow: 'auto', maxHeight: '80vh', }}>
          <Typography variant="h6">Unread Notifications ({notificationCount})</Typography>
          <List>
            {unreadNotifications.map(notification => (
              <ListItem
                key={notification.id}
                onClick={() => handleSelectNotification(notification)}
                sx={{
                  backgroundColor: selectedNotification?.id === notification.id ? '#d0e9cf' : '#f9f9f9',
                  cursor: 'pointer',
                  mb: 1,
                  border: selectedNotification?.id === notification.id ? '1px solid rgb(0, 58, 22)' : '1px solid #ddd',
                  borderRadius: '8px'
                }}
              >
                <ListItemText
                  primary={
                    <span style={{ fontWeight: notification.tempRead ? 'normal' : 'bold' }}>
                      {notification.title}
                    </span>
                  }
                  secondary={new Date(notification.created_at).toLocaleString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                />
                <AiOutlineMail size={20} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Read Notifications</Typography>
          <List>
            {readNotifications.map(notification => (
              <ListItem
                key={notification.id}
                onClick={() => handleSelectNotification(notification)}
                sx={{
                  backgroundColor: selectedNotification?.id === notification.id ? '#d0e9cf' : '#f9f9f9',
                  cursor: 'pointer',
                  mb: 1,
                  border: selectedNotification?.id === notification.id ? '1px solid rgb(0, 58, 22)' : '1px solid #ddd',
                  borderRadius: '8px'
                }}
              >
                <ListItemText
                  primary={notification.title}
                  secondary={new Date(notification.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>

      {/* Notification Content */}
      <Grid size={{ xs: 8 }}>
        <Box display="flex" flexDirection="column" p={2}>
          {selectedNotification && (
            <Box display="flex" alignItems="center" borderBottom="1px solid #ccc" pb={2} mb={2}>
              <IconButton
                onClick={() => markAsRead(selectedNotification.id)}
                disabled={selectedNotification.is_read}
              >
                <AiOutlineCheck size={20} />
              </IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <IconButton
                onClick={() => {
                  selectedNotification.is_read = true;
                  selectedNotification.tempRead = true;
                  deleteNotification(selectedNotification.id)
                }}
              >
                <AiOutlineDelete size={20} />
              </IconButton>
            </Box>
          )}
          {selectedNotification && (
            <Box>
              <Typography variant="h6">
                {selectedNotification.type === 'message' && selectedNotification.sender
                  ? <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    <Typography>Message From </Typography>
                    <Link to={"/players/" + selectedNotification.sender.slug} target='_blank' >
                      {selectedNotification.sender.name}
                    </Link>
                  </Box>
                  : selectedNotification.title
                }
              </Typography>
              <Typography variant="body2">
                {selectedNotification.message}
              </Typography>
              {loading ? <LinearProgress /> :
                <>
                  {selectedNotification.related_object && (
                    <Box>
                      {/* Only show generic event link for non-payment types */}
                      {selectedNotification.type !== 'payment_required' && (
                        <Link to={selectedNotification.related_object.url} style={{ marginRight: 10 }} target='_blank'>
                          Go to {selectedNotification.related_object.name}
                        </Link>
                      )}
                      {selectedNotification.type === 'join_request' &&
                        <Link to={'/players/' + selectedNotification.sender.slug} style={{ marginRight: 10 }} target='_blank'>
                          <Box sx={{ display: "flex", mt: 1, alignItems: "center", gap: 1 }}>
                            <ProfileImage player={selectedNotification.sender} size={30} />
                            <Typography>{selectedNotification.sender.name}</Typography>
                          </Box>
                        </Link>
                      }
                      {selectedNotification.type === 'join_request' && selectedNotification.metadata?.partner && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, ml: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">Partner:</Typography>
                          <Link to={'/players/' + selectedNotification.metadata.partner.slug} target='_blank'>
                            <Typography variant="body2" fontWeight={600}>
                              {selectedNotification.metadata.partner.name}
                            </Typography>
                          </Link>
                        </Box>
                      )}
                      {selectedNotification.type === 'join_request' && selectedNotification.division_name && (
                        <Chip
                          label={`Division: ${selectedNotification.division_name}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  )}
                  {selectedNotification.type === 'message' && isLoggedIn && (
                    <Box display={'flex'} gap={1} alignItems={'center'}>
                      <AiOutlineMessage
                        onClick={() => setShowChatModal(true)}
                        color='green'
                        size={25}
                        cursor={'pointer'}
                      />
                      <Typography sx={{ cursor: 'pointer', color: 'green' }} onClick={() => setShowChatModal(true)}>See chat</Typography>
                    </Box>
                  )}
                </>
              }

              {/* Actions */}
              {selectedNotification.type === 'join_request' && (
                <Box mt={2}>
                  {eventBillableItem && selectedNotification?.status === 'pending' && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight={600}>
                        Entry Fee: ${parseFloat(eventBillableItem.amount).toFixed(2)}
                      </Typography>
                      {eventBillableItem.description && (
                        <Typography variant="body2">{eventBillableItem.description}</Typography>
                      )}
                      {eventBillableItem.refund_policy && (
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          Refund policy: {displayRefundPolicy(eventBillableItem.refund_policy)}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        Upon approval, the {selectedNotification?.metadata?.partner ? 'pair' : 'player'} will be notified to complete payment to confirm their spot.
                      </Typography>
                    </Alert>
                  )}
                  {selectedNotification?.status === 'pending' ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="contained" color="success" onClick={() => handleAction(true)}>
                        Approve
                      </Button>
                      <Button variant="contained" color="error" onClick={() => handleAction(false)}>
                        Deny
                      </Button>
                    </Box>
                  ) : (
                    <Typography><i>This request has been {selectedNotification?.status || 'processed'}</i></Typography>
                  )}
                </Box>
              )}

              {/* payment_required: player completes payment */}
              {selectedNotification.type === 'payment_required' && (
                <Box mt={2}>
                  {paymentDone ? (
                    <Alert severity="success">
                      Payment received! Your spot is being confirmed. You should have recieved a confirmation notification. If you have any questions, contact the organizer.
                    </Alert>
                  ) : (paymentStatus === null || paymentStatus === 'checking') ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Checking payment status...
                      </Typography>
                    </Box>
                  ) : paymentStatus === 'pending' ? (
                    <Alert severity="info">
                      Your payment is processing — hang tight. You'll get a notification once confirmed.
                    </Alert>
                  ) : paymentStatus === 'refunded' ? (
                    <Alert severity="warning">
                      Your previous payment was refunded. Contact the organizer if you have questions.
                    </Alert>
                  ) : ['unpaid', 'failed'].includes(paymentStatus) ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Alert severity="warning">
                        <Typography variant="body2" fontWeight={600}>
                          Complete payment to confirm your spot
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Your organizer has approved your request. Pay to secure your place.
                        </Typography>
                      </Alert>

                      {eventBillableItem && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {eventBillableItem.event && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" color="text.secondary">Event:</Typography>
                              <Link
                                to={`/events/${eventBillableItem.event.id}`}
                                target="_blank"
                                style={{ fontWeight: 600, fontSize: '1rem' }}
                              >
                                {eventBillableItem.event.name}
                              </Link>
                            </Box>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">Entry fee:</Typography>
                            <Typography variant="body2" fontWeight={600}>
                              ${parseFloat(eventBillableItem.amount).toFixed(2)}
                            </Typography>
                          </Box>
                          {eventBillableItem.refund_policy && (
                            <Typography variant="caption" color="text.secondary" fontStyle="italic">
                              Refund policy: {displayRefundPolicy(eventBillableItem.refund_policy)}
                            </Typography>
                          )}
                        </Box>
                      )}

                      {!paymentClientSecret ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handlePayNow}
                          disabled={paymentLoading}
                          startIcon={paymentLoading ? <CircularProgress size={16} /> : null}
                          sx={{ alignSelf: 'flex-start' }}
                        >
                          {paymentLoading ? 'Loading...' : 'Pay Now'}
                        </Button>
                      ) : (
                        <StripeProvider
                          clientSecret={paymentClientSecret}
                          stripeAccount={paymentStripeAccount}
                        >
                          <CheckoutForm
                            returnUrl={`${window.location.origin}/notifications`}
                            onSuccess={async () => {
                              const updated = { ...selectedNotification, status: 'paid' };
                              updateNotification(updated);
                              setSelectedNotification(updated);
                              // Add participant to the event now that payment is complete.
                              // Pass participant_id from metadata so the backend links the
                              // pre-created Participant entity (doubles pair / team) rather
                              // than creating a new one.
                              try {
                                const eventId = eventBillableItem?.event?.id;
                                const participantId = selectedNotification.metadata?.participant_id ?? null;
                                if (eventId) {
                                  const participant = { type: 'player', id: user.id };
                                  if (participantId) participant.participant_id = participantId;
                                  if (selectedNotification.division_id) {
                                    participant.division_id = selectedNotification.division_id;
                                    await divisionAPI.addDivisionParticipants(selectedNotification.division_id, participant);
                                  } else {
                                    await eventAPI.addParticipant(eventId, participant);
                                  }
                                }
                              } catch (err) {
                                showSnackbar('Payment received, but failed to add you to the event. Please contact the organizer.', 'warning');
                              }
                            }}
                            onError={() => {
                              setPaymentClientSecret(null);
                              setPaymentStripeAccount(null);
                            }}
                          />
                        </StripeProvider>
                      )}
                    </Box>
                  ) : null}
                </Box>
              )}

              {/* join_confirmed: player's spot is confirmed */}
              {selectedNotification.type === 'join_confirmed' && (
                <Box mt={2}>
                  <Chip label="You're in!" color="success" />
                  {selectedNotification.related_object && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Head to{' '}
                      <Link to={selectedNotification.related_object.url} target="_blank">
                        {selectedNotification.related_object.name}
                      </Link>{' '}
                      to see the details.
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
          <MyModal
            showHide={showChatModal}
            onClose={() => setShowChatModal(false)}
            title={`Send ${selectedNotification?.name} a message`}
          >
            Send a message
            <Conversation player1={user} player2={selectedNotification?.sender} />
          </MyModal>
        </Box>
      </Grid>
      {/* 
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      /> */}
    </Grid>

  );
};

export default NotificationsView;
