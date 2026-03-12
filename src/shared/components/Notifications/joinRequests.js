import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { AiOutlineClockCircle } from 'react-icons/ai'
import requestAPI from 'api/services/request'
import { Alert, Box, List, ListItem, Snackbar, Typography } from '@mui/material'
import { AuthContext } from 'contexts/AuthContext'
import { eventAPI, billableItemAPI, stripeAPI, divisionAPI, participantAPI } from 'api/services'
import InfoPopup from '../infoPopup'
import MyModal from 'shared/components/layout/MyModal'
import { Link } from 'react-router-dom'
import PlayerSearch from 'features/player/components/playerSearch'
import Wizard from '../Wizard/Wizard'
import StripeProvider from 'features/stripe/components/StripeProvider'
import CheckoutForm from 'features/stripe/components/CheckoutForm'
import { displayRefundPolicy } from 'helpers'

const JoinRequest = ({ objectType, id, matchType, isMember,
  memberText, isOpenRegistration = false, callback, restrictions, divisionId = null, divisionName = null,
  prefetchedBillableItems = null, prefetchedRestrictions = null, prefetchedRequestStatus = null,
  ...props }) => {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('info')
  const [loading, setLoading] = useState(false)
  const [restrictionResult, setRestrictionResult] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { isLoggedIn, user } = useContext(AuthContext)
  const [modalType, setModalType] = useState(null) // 'doubles' or 'single'
  const [doublesCandidates, setDoublesCandidates] = useState([])
  const [doublesPartner, setDoublesPartner] = useState(null)
  const [billableItem, setBillableItem] = useState(null)
  const [paymentClientSecret, setPaymentClientSecret] = useState(null)
  const [paymentStripeAccount, setPaymentStripeAccount] = useState(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)
  const [isPostApprovalPay, setIsPostApprovalPay] = useState(false)
  const [pendingParticipantId, setPendingParticipantId] = useState(null)

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false)
  }

  useEffect(() => {


    const checkEligibility = async () => {
      setLoading(true)
      let passed = true
      try {
        if (objectType === 'event') {
          if (prefetchedRestrictions != null) {
            // Use pre-fetched data — no API call needed
            passed = prefetchedRestrictions.allowed
            if (!passed) setRestrictionResult(prefetchedRestrictions.reasons || [])
          } else {
            // Fallback: fetch and resolve the right key from the dict
            const response = await eventAPI.checkRequirements(id, user.id)
            const divData = response[divisionId] ?? response['event']
            passed = divData.allowed
            if (!passed) setRestrictionResult(divData.reasons || [])
          }
        }
      }
      catch (error) {
        console.error("Error checking restrictions:", error);
        setRestrictionResult(["Failed to fetch restriction data."]);
        passed = false
      }
      finally {
        setLoading(false)
      }
      return passed
    }

    async function setJoinRequest() {
      setError(null)
      try {
        const isEligible = await checkEligibility();
        if (isEligible) {
          if (prefetchedRequestStatus != null) {
            // Use pre-fetched data — no API call needed
            setStatus(prefetchedRequestStatus.status || 'none')
            if (prefetchedRequestStatus.participant_id) setPendingParticipantId(prefetchedRequestStatus.participant_id)
          } else {
            // Fallback: fetch and resolve the right key from the dict
            const res = await requestAPI.getRequestStatusForUser(id)
            if (res.success) {
              const statusData = res.data[divisionId] ?? res.data['event']
              setStatus(statusData?.status || 'none')
              if (statusData?.participant_id) setPendingParticipantId(statusData.participant_id)
            } else {
              setError('Error fetching join request status.')
              setStatus('none')
              showSnackbar('Error fetching join request status.', 'error')
            }
          }
        }
        else {
          setStatus('not_eligible')
        }
      } catch (error) {
        console.error("Error checking restrictions:", error);
        setRestrictionResult(["Something went wrong."]);
        setStatus("error");
      }
    }
    if (isLoggedIn && user?.id) {
      setJoinRequest();
    }
  }, [id, divisionId, isLoggedIn, user, objectType, prefetchedRestrictions, prefetchedRequestStatus])

  useEffect(() => {
    const fetchBillableItems = async () => {
      if (objectType !== 'event' || !id) return;
      try {
        // Use pre-fetched items if available, otherwise fetch
        let items;
        if (prefetchedBillableItems !== null) {
          items = prefetchedBillableItems;
        } else {
          const res = await billableItemAPI.getEventBillableItems(id);
          items = res.success ? (res.data || []) : [];
        }
        if (items.length > 0) {
          // Prefer a division-specific fee; fall back to event-level fee
          const divisionItem = divisionId
            ? items.find((i) => i.target_type === 'division' && i.target_id === divisionId)
            : null;
          const eventItem = items.find((i) => i.target_type === 'event' || !i.target_type);
          setBillableItem(divisionItem || eventItem || null);
        }
      } catch (err) {
        console.warn('Failed to fetch billable items:', err);
      }
    };
    fetchBillableItems();
  }, [id, divisionId, objectType, prefetchedBillableItems]);

  const handleSignUp = async (participant_type = 'player', participantId = null) => {
    setLoading(true)
    try {
      let participant = { type: participant_type }
      if (participant_type === 'player') participant.id = user.id;
      if (participant_type === 'doubles') {
        participant.player_ids = [user.id, doublesPartner.id];
      }
      // Add division_id if this is a division-specific signup
      if (divisionId) {
        participant.division_id = divisionId;
      }
      // Link pre-created participant entity if available (doubles/team approval flow)
      if (participantId) participant.participant_id = participantId;
      let response
      if (divisionId) {
        response = await divisionAPI.addDivisionParticipants(divisionId, participant)
      }
      else response = await eventAPI.addParticipant(id, participant)
      if (!response || response.error) {
        throw new Error('Failed to sign up for event')
      }
      showSnackbar('You have been added to the event', 'success')
      if (callback) {
        callback();
      }
    }
    catch (e) {
      setError('Error signing up.')
      showSnackbar('Error signing up.', 'error')
      setStatus('none')
    }
    finally {
      console.log('finally')
      setLoading(false)
      setShowModal(false)
    }
  }

  const handleInitiatePayment = async () => {
    setPaymentLoading(true);
    try {
      const statusRes = await stripeAPI.getBillableItemPaymentStatus(billableItem.id);
      if (statusRes.success && statusRes.data?.has_payment) {
        if (statusRes.data.status === 'succeeded') {
          showSnackbar('Payment already completed for this entry.', 'info');
          setPaymentDone(true);
          setPaymentLoading(false);
          return;
        }
        if (statusRes.data.status === 'pending') {
          showSnackbar('A payment is already being processed. Please wait.', 'warning');
          setPaymentLoading(false);
          return;
        }
      }
      const res = await stripeAPI.createPaymentIntent(billableItem.id);
      if (res.success && res.data?.client_secret) {
        setPaymentClientSecret(res.data.client_secret);
        setPaymentStripeAccount(res.data.stripe_account_id || null);
      } else {
        showSnackbar(res.data?.error || 'Failed to start payment', 'error');
      }
    } catch (err) {
      showSnackbar(err.message, 'error');
    } finally {
      setPaymentLoading(false);
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setPaymentClientSecret(null);
    setPaymentDone(false);
    setIsPostApprovalPay(false);
  }

  const handleConfirmRequest = async (participantId = null, partnerId = null) => {
    setLoading(true)
    try {
      await requestAPI.createJoinRequest(objectType, id, divisionId, participantId, partnerId)
      setStatus('pending')
      showSnackbar('Join request sent successfully!', 'success')
      handleCloseModal()
      // No callback here — the event data hasn't changed (no participant added yet).
      // The local status update to 'pending' is sufficient to update the UI.
    } catch (err) {
      setError('Error sending join request.')
      showSnackbar('Error sending join request.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const canRegisterDirectly = () => {
    if (!isOpenRegistration) return false;
    const today = new Date().getTime();
    // If a start date is set, block direct registration once the event has started
    if (props.startDate) {
      const startDate = new Date(`${props.startDate}T00:00:00Z`).getTime();
      if (!isNaN(startDate) && today >= startDate) return false;
    }
    // If a registration open date is set, block until that date has passed
    if (props.registrationDate) {
      const registrationDate = new Date(`${props.registrationDate}T00:00:00Z`).getTime();
      if (!isNaN(registrationDate) && today < registrationDate) return false;
    }
    return true;
  }

  // For approval-required events, still block any signup after the event has started
  const canSignUp = () => {
    if (!props.startDate) return true;
    const startDate = new Date(`${props.startDate}T00:00:00Z`).getTime();
    if (!isNaN(startDate) && new Date().getTime() >= startDate) return false;
    return true;
  }

  const isDirect = canRegisterDirectly()
  const isPaidEvent = !!billableItem

  // create a preFilter based on the restrictions to limit partner selection
  const doublesPreFilter = (() => {
    const pf = {};
    if (!restrictions) return pf;

    Object.entries(restrictions).forEach(([key, val]) => {
      if (val == null) return;
      // age: backend expects a JSON object with keys 'over', 'under' or 'between'
      if (key === 'age') {
        const min = val?.min ? Number(val.min) : null;
        const max = val?.max ? Number(val.max) : null;
        if (val.type === 'over') {
          pf[key] = JSON.stringify({ over: min });
        } else if (val.type === 'under') {
          pf[key] = JSON.stringify({ under: max });
        } else if (val.type === 'between') {
          pf[key] = JSON.stringify({ between: [min, max] });
        }
      }
      else if (key === 'club') pf[key] = JSON.stringify({ id: val["id"] })
      // gender, rating
      else pf[key] = val['value'];
    });

    return pf;
  })();

  const doublesWizardSteps = [
    {
      label: 'Select Partner',
      //description: 'Select Partner',
      content: (
        <Box sx={{ mb: 2 }}>
          <Typography>
            Signing up as {user?.name}.
          </Typography>
          <Typography>
            Who is your partner for this doubles event?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <PlayerSearch
              excludePlayers={[user]}
              maxSelection={1}
              preFilter={doublesPreFilter}
              onResults={(players) => {
                console.log('Doubles partner candidates:', players)
                setDoublesCandidates(players)
              }}
              manualSearch={true}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {doublesCandidates.length} partner candidate{doublesCandidates.length !== 1 ? 's' : ''} found
            </Typography>
            {doublesCandidates.map((p) => (
              <Box
                key={p.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  mb: 1,
                  border: 1,
                  borderColor: doublesPartner?.id === p.id ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  bgcolor: doublesPartner?.id === p.id ? 'primary.light' : 'background.paper',
                  opacity: doublesPartner?.id === p.id ? 1 : 0.8,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: doublesPartner?.id === p.id ? 'primary.light' : 'action.hover',
                    opacity: 1
                  }
                }}
              >
                <Typography>{p.name}</Typography>
                <Button
                  variant={doublesPartner?.id === p.id ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setDoublesPartner(doublesPartner?.id === p.id ? null : p)}
                >
                  {doublesPartner?.id === p.id ? 'Selected' : 'Select'}
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      ),
      handleNext: () => { return doublesPartner != null; }
    },
    {
      label: isPaidEvent && isDirect ? 'Confirm & Pay' : 'Confirm Sign Up',
      content: isPaidEvent && isDirect ? (
        // Paid + open registration
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>
            Signing up as a pair: you and <strong>{doublesPartner?.name}</strong>.
          </Typography>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Entry Fee: ${billableItem && parseFloat(billableItem.amount).toFixed(2)}
          </Typography>
          <Typography variant="body2" gutterBottom>
            This fee covers both players. You are responsible for the full payment — settle the split with your partner directly.
          </Typography>
          {billableItem?.description && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {billableItem.description}
            </Typography>
          )}
          {billableItem?.refund_policy && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }} gutterBottom>
              Refund policy: {displayRefundPolicy(billableItem.refund_policy)}
            </Typography>
          )}
          {!paymentClientSecret ? (
            <Button
              variant="contained" color="primary"
              onClick={handleInitiatePayment}
              disabled={paymentLoading}
              sx={{ mt: 1 }}
            >
              {paymentLoading ? <CircularProgress size={20} /> : 'Proceed to Payment'}
            </Button>
          ) : (
            <StripeProvider
              clientSecret={paymentClientSecret}
              stripeAccount={paymentStripeAccount}
            >
              <CheckoutForm
                returnUrl={`${window.location.origin}/events/${id}`}
                onSuccess={() => { setPaymentDone(true); handleSignUp('doubles'); }}
                onError={() => { setPaymentClientSecret(null); setPaymentStripeAccount(null); }}
              />
            </StripeProvider>
          )}
        </Box>
      ) : isPaidEvent && !isDirect ? (
        // Paid + approval required
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>
            Signing up as a pair: you and <strong>{doublesPartner?.name}</strong>.
          </Typography>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Entry Fee: ${billableItem && parseFloat(billableItem.amount).toFixed(2)}
          </Typography>
          <Typography variant="body2" gutterBottom>
            This event requires organizer approval. Once approved, you'll be notified to complete
            the <strong>${billableItem && parseFloat(billableItem.amount).toFixed(2)}</strong> entry fee.
            This fee covers both players — you are responsible for the full amount.
          </Typography>
          {billableItem?.refund_policy && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }} gutterBottom>
              Refund policy: {displayRefundPolicy(billableItem.refund_policy)}
            </Typography>
          )}
        </Box>
      ) : isDirect ? (
        // Free + open registration
        <Box sx={{ mb: 2 }}>
          <Typography>
            {divisionName
              ? <>You are about to sign up for <strong>{divisionName}</strong> with partner <strong>{doublesPartner?.name}</strong>. Confirm to join.</>
              : <>You are about to sign up with partner <strong>{doublesPartner?.name}</strong>. Confirm to join.</>
            }
          </Typography>
        </Box>
      ) : (
        // Free + approval required
        <Box sx={{ mb: 2 }}>
          <Typography>
            {divisionName
              ? <>You are about to request to join <strong>{divisionName}</strong> with partner <strong>{doublesPartner?.name}</strong>. Your request will be sent to the organizer for review.</>
              : <>You are about to request to join with partner <strong>{doublesPartner?.name}</strong>. Your request will be sent to the organizer for review.</>
            }
          </Typography>
        </Box>
      ),
    }
  ];
  const doublesModalContent = (
    <Wizard
      steps={doublesWizardSteps}
      handleSubmit={async () => {
        if (!isDirect) {
          // Pre-create the doubles Participant entity so the organizer
          // sees the full pair when reviewing the request.
          // Backend links it; approval flips the EventParticipant connection.
          let participantId = null;
          try {
            const res = await participantAPI.create('doubles', [user.id, doublesPartner.id]);
            if (res.success) {
              participantId = res.data?.participant_id ?? null;
              if (!participantId) console.warn('participantAPI.create succeeded but no participant_id found in response:', res.data);
            } else {
              showSnackbar('Could not register pair. Please try again.', 'error');
              return;
            }
          } catch (e) {
            showSnackbar('Could not register pair. Please try again.', 'error');
            return;
          }
          await handleConfirmRequest(participantId, doublesPartner?.id)
          return
        }
        if (isPaidEvent && !paymentDone) {
          showSnackbar('Please complete payment above to confirm your spot', 'warning')
          return
        }
        if (!paymentDone) {
          handleSignUp('doubles')
        }
        // if paymentDone, handleSignUp was already called via onSuccess
      }}
      hideSubmit={isPaidEvent && isDirect}
      submitText={
        !isDirect ? 'Send Request' :
        'Confirm Sign Up'
      }
    />
  )
  const ConfirmModalContent = (
    <Box>
      {/* Free + open registration */}
      {!isPaidEvent && isDirect && (
        <>
          <Typography gutterBottom>
            {divisionName
              ? <>You are about to sign up for <strong>{divisionName}</strong>. Confirm to join.</>
              : <>You are about to sign up for this event. Confirm to join.</>
            }
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={() => handleSignUp()} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Confirm Sign Up'}
            </Button>
          </Box>
        </>
      )}

      {/* Free + approval required */}
      {!isPaidEvent && !isDirect && (
        <>
          <Typography gutterBottom>
            {divisionName
              ? <>This division requires organizer approval. Your request to join <strong>{divisionName}</strong> will be sent for review — you'll be notified once approved.</>
              : <>This event requires organizer approval. Your request will be sent for review — you'll be notified once approved.</>
            }
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={() => handleConfirmRequest()} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Send Request'}
            </Button>
          </Box>
        </>
      )}

      {/* Paid + open registration */}
      {isPaidEvent && isDirect && !paymentDone && (
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Entry Fee: ${parseFloat(billableItem.amount).toFixed(2)}
          </Typography>
          {billableItem.description && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {billableItem.description}
            </Typography>
          )}
          {billableItem.refund_policy && (
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic' }}>
              Refund policy: {displayRefundPolicy(billableItem.refund_policy)}
            </Typography>
          )}
          {!paymentClientSecret ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={handleInitiatePayment} disabled={paymentLoading}>
                {paymentLoading ? <CircularProgress size={20} /> : 'Proceed to Payment'}
              </Button>
            </Box>
          ) : (
            <StripeProvider clientSecret={paymentClientSecret} stripeAccount={paymentStripeAccount}>
              <CheckoutForm
                returnUrl={`${window.location.origin}/events/${id}`}
                onSuccess={() => { setPaymentDone(true); handleSignUp(); }}
                onError={() => { setPaymentClientSecret(null); setPaymentStripeAccount(null); }}
              />
            </StripeProvider>
          )}
        </Box>
      )}

      {/* Paid + approval required — pre-approval: send join request */}
      {isPaidEvent && !isDirect && !isPostApprovalPay && (
        <>
          <Typography gutterBottom>
            {divisionName
              ? <>This division (<strong>{divisionName}</strong>) requires organizer approval before payment is collected.</>
              : <>This event requires organizer approval before payment is collected.</>
            }
          </Typography>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Entry Fee: ${parseFloat(billableItem.amount).toFixed(2)}
          </Typography>
          {billableItem.description && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {billableItem.description}
            </Typography>
          )}
          <Typography variant="body2" gutterBottom sx={{ mt: 1 }}>
            Once approved, you'll receive a notification to complete your{' '}
            <strong>${parseFloat(billableItem.amount).toFixed(2)}</strong> payment to confirm your spot.
          </Typography>
          {billableItem.refund_policy && (
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic' }}>
              Refund policy: {displayRefundPolicy(billableItem.refund_policy)}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={() => handleConfirmRequest()} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Send Request'}
            </Button>
          </Box>
        </>
      )}

      {/* Paid + approval required — post-approval: complete payment */}
      {isPaidEvent && !isDirect && isPostApprovalPay && (
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Entry Fee: ${parseFloat(billableItem.amount).toFixed(2)}
          </Typography>
          {billableItem.description && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {billableItem.description}
            </Typography>
          )}
          {billableItem.refund_policy && (
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic' }}>
              Refund policy: {displayRefundPolicy(billableItem.refund_policy)}
            </Typography>
          )}
          {!paymentClientSecret ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={handleInitiatePayment} disabled={paymentLoading}>
                {paymentLoading ? <CircularProgress size={20} /> : 'Proceed to Payment'}
              </Button>
            </Box>
          ) : (
            <StripeProvider clientSecret={paymentClientSecret} stripeAccount={paymentStripeAccount}>
              <CheckoutForm
                returnUrl={`${window.location.origin}/events/${id}`}
                onSuccess={() => { setPaymentDone(true); setStatus('approved'); handleSignUp('player', pendingParticipantId); }}
                onError={() => { setPaymentClientSecret(null); setPaymentStripeAccount(null); }}
              />
            </StripeProvider>
          )}
        </Box>
      )}
    </Box>
  )


  const handleJoinRequest = () => {
    if (matchType === 'doubles') {
      setModalType('doubles')
      setShowModal(true)
      return
    }
    setModalType('single')
    setShowModal(true)
  }

  // canRegisterDirectly is now defined earlier in the component (before doublesWizardSteps)

  if (!isLoggedIn) {
    return (
      <Box sx={{ p: 1.5 }}>
        <Typography variant='body2'>
          Do you want to join? <br />
          Sign up for account today!
        </Typography>
        <Button
          variant="contained"
          color="info"
          component={Link}
          to="/Registration"
        >
          Register an account
        </Button>
      </Box>
    )
  }

  if (status === 'loading' || loading) {
    return <CircularProgress />
  }

  if (status === 'not_eligible') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Typography>You can't join this league</Typography>
        <InfoPopup>
          {restrictionResult && (
            <Box>
              <Typography variant="h6">You do not meet the requirements to signup:</Typography>
              <List>
                {restrictionResult?.map((reason, index) => (
                  <ListItem key={index}>- {reason}</ListItem>
                ))}
              </List>
            </Box>
          )}
        </InfoPopup>
      </Box>
    )
  }

  return (
    <Box>
      {error && ''}
      {isMember ?
        <Button variant="contained" disabled>
          {memberText || 'Member'}
        </Button>
        : <>
          {status === 'none' && canSignUp() && (
            <Button variant="contained" color="primary" onClick={handleJoinRequest}>
              {canRegisterDirectly() ? 'Sign Up' : 'Request to Join'}
            </Button>
          )}
          {status === 'none' && !canSignUp() && (
            <Button variant="outlined" disabled>
              Registration Closed
            </Button>
          )}
          {status === 'pending' && (
            <Button variant="outlined" disabled startIcon={<AiOutlineClockCircle />}>
              Request to Join Pending
            </Button>
          )}
          {status === 'denied' && (
            <Button variant="outlined" color="secondary" onClick={handleJoinRequest}>
              Request to Join Denied - Try Again?
            </Button>
          )}
          {status === 'approved_pending_payment' && (
            <Alert
              severity="warning"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setIsPostApprovalPay(true)
                    setModalType('single')
                    setShowModal(true)
                  }}
                >
                  Pay Now
                </Button>
              }
            >
              Your spot is reserved — complete payment to confirm your place.
            </Alert>
          )}
        </>
      }
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <MyModal showHide={showModal} onClose={handleCloseModal} title={divisionName ? `Sign Up: ${divisionName}` : 'Confirm Signing up'}>
        {modalType === 'doubles' && doublesModalContent}
        {modalType === 'single' && ConfirmModalContent}
      </MyModal>
    </Box>
  )
}

export default JoinRequest