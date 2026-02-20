import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { AiOutlineClockCircle } from 'react-icons/ai'
import requestAPI from 'api/services/request'
import { Alert, Box, List, ListItem, Snackbar, Typography } from '@mui/material'
import { AuthContext } from 'contexts/AuthContext'
import { eventAPI, billableItemAPI, stripeAPI } from 'api/services'
import InfoPopup from '../infoPopup'
import MyModal from 'components/layout/MyModal'
import { Link } from 'react-router-dom'
import PlayerSearch from '../Player/playerSearch'
import Wizard from '../Wizard/Wizard'
import StripeProvider from 'components/forms/Stripe/StripeProvider'
import CheckoutForm from 'components/forms/Stripe/CheckoutForm'

const JoinRequest = ({ objectType, id, matchType, isMember,
  memberText, isOpenRegistration = false, callback, restrictions, divisionId = null, ...props }) => {
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
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)

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
          const response = await eventAPI.checkRequirements(id, user.id)
          passed = response.allowed
          if (!response.allowed) {
            setRestrictionResult(response.reasons || [])
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
          requestAPI.getRequestStatusForUser(id)
            .then((status) => {
              console.log(status)
              setStatus(status.status)
            })
            .catch((err) => {
              setError('Error fetching join request status.')
              setStatus('none')
              showSnackbar('Error fetching join request status.', 'error')
            })
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
  }, [id, isLoggedIn, user, objectType])

  useEffect(() => {
    const fetchBillableItems = async () => {
      if (objectType !== 'event' || !id) return;
      try {
        const res = await billableItemAPI.getEventBillableItems(id);
        if (res.success && res.data && res.data.length > 0) {
          setBillableItem(res.data[0]);
        }
      } catch (err) {
        console.warn('Failed to fetch billable items:', err);
        // no billable items or error — treat as free event
      }
    };
    fetchBillableItems();
  }, [id, objectType]);

  const handleSignUp = async (participant_type='player') => {
    setLoading(true)
    try {
      let participant = { type: participant_type}
      if (participant_type === 'player') participant.id = user.id;
      if (participant_type === 'doubles') {
        participant.player_ids = [user.id, doublesPartner.id];
      }
      // Add division_id if this is a division-specific signup
      if (divisionId) {
        participant.division_id = divisionId;
      }
      const response = await eventAPI.addParticipant(id, participant)
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
    if (!billableItem) return;
    setPaymentLoading(true);
    try {
      const res = await stripeAPI.createPaymentIntent(billableItem.id);
      if (res.success && res.data?.client_secret) {
        setPaymentClientSecret(res.data.client_secret);
      } else {
        showSnackbar('Failed to initiate payment. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      showSnackbar('Failed to initiate payment. Please try again.', 'error');
    } finally {
      setPaymentLoading(false);
    }
  }

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
      label: 'Confirm Sign Up',
      description: 'Confirm Sign Up',
      content: (
        <Box sx={{ mb: 2 }}>
          <Typography>
            You are about to sign up with partner {doublesPartner?.name}.
          </Typography>
        </Box>
      ),
    }
  ];
  const doublesModalContent = (
    <Wizard
      steps={doublesWizardSteps}
      handleSubmit={() => { 
        showSnackbar(`Signing up with partner ${doublesPartner?.name}`, 'info'); 
        // implement sign up with partner logic here
        handleSignUp('doubles');
        
      }}
      submitText="Confirm Sign Up"
    />

  )
  const SingleModalContent = (
    <Box>
      <Typography>
        You are about to sign up.
      </Typography>
      {billableItem && !paymentDone && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Entry Fee: ${(billableItem.amount / 100).toFixed(2)}
          </Typography>
          {billableItem.description && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {billableItem.description}
            </Typography>
          )}
          {!paymentClientSecret ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleInitiatePayment}
              disabled={paymentLoading}
              sx={{ mt: 1 }}
            >
              {paymentLoading ? <CircularProgress size={20} /> : 'Proceed to Payment'}
            </Button>
          ) : (
            <StripeProvider clientSecret={paymentClientSecret}>
              <CheckoutForm
                returnUrl={`${window.location.origin}/events/${id}`}
                onSuccess={() => {
                  setPaymentDone(true);
                  handleSignUp();
                }}
              />
            </StripeProvider>
          )}
        </Box>
      )}
      {(!billableItem || paymentDone) && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSignUp} sx={{ ml: 2 }}>
            Sign Up!
          </Button>
        </Box>
      )}
    </Box>
  )

  const handleCloseModal = () => {
    setShowModal(false);
    setPaymentClientSecret(null);
    setPaymentDone(false);
  }

  const handleJoinRequest = async () => {
    // console.log('handleJoinRequest called. Match type:', matchType);
    if (matchType === 'doubles') {
      console.log('Current user:', user);
      setModalType('doubles')
      setShowModal(true)
      return
    }
    if (canRegisterDirectly()) {
      setModalType('single')
      setShowModal(true)
      return
    }
    else {
      requestAPI.createJoinRequest(objectType, id)
        .then(() => {
          setStatus('pending')
          showSnackbar('Join request sent successfully!', 'success')
        })
        .catch((err) => {
          setError('Error sending join request.')
          showSnackbar('Error sending join request.', 'error')
        })
    }
  }

  const canRegisterDirectly = () => {
    const today = new Date().getTime(); // Get current time in milliseconds
    const startDate = new Date(`${props.startDate}T00:00:00Z`).getTime(); // for UTC time
    const registrationDate = new Date(`${props.registrationDate}T00:00:00Z`).getTime();

    return isOpenRegistration && today < startDate && today > registrationDate;
  }

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
          {status === 'none' && (
            <Button variant="contained" color="primary" onClick={handleJoinRequest}>
              {canRegisterDirectly() ? 'Sign Up' : 'Request to Join'}
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

      <MyModal showHide={showModal} onClose={handleCloseModal} title="Confirm Signing up">
        {modalType === 'doubles' && doublesModalContent}
        {modalType === 'single' && SingleModalContent}
      </MyModal>
    </Box>
  )
}

export default JoinRequest