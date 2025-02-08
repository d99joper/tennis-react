import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { AiOutlineClockCircle } from 'react-icons/ai'
import requestAPI from 'api/services/request'
import { Alert, Box, List, ListItem, Snackbar, Typography } from '@mui/material'
import { AuthContext } from 'contexts/AuthContext'
import { eventAPI } from 'api/services'
import { userHelper } from 'helpers'
import InfoPopup from './infoPopup'
import MyModal from 'components/layout/MyModal'

const JoinRequest = ({ objectType, id, isMember, memberText, isOpenRegistration = false, callback, ...props }) => {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('info')
  const [loading, setLoading] = useState(false)
  const [restrictionResult, setRestrictionResult] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { isLoggedIn, user } = useContext(AuthContext)

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
    async function setJoinRequest() {
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
    }
    if (isLoggedIn) {
      setJoinRequest();
    }
  }, [id])

  const checkEligibility = async () => {
    setLoading(true)
    let passed = true
    try {
      if (objectType === 'event') {
        const response = await eventAPI.checkRequirements(id, user.id)
        passed = response.allowed
        if (!response.allowed) {
          setRestrictionResult(response.reasons)
        }
      }
    }
    catch (error) {
      console.error("Error checking restrictions:", error);
      setRestrictionResult({ allowed: false, reasons: ["Failed to fetch restriction data."] });
      passed = false
    }
    finally {
      setLoading(false)
    }
    return passed
  }

  const handleSignUp = async () => {
    setLoading(true)
    try {
      const participant = {type: 'player', id: user.id}
      const response = await eventAPI.addParticipant(id, participant)
      showSnackbar('You have been added to the event', 'success')
      if(callback) {
        callback();
      }
    }
    catch (e) {
      setError('Error signing up.')
      showSnackbar('Error signing up.', 'error')
      setStatus('none')
    }
    finally{
      console.log('finally')
      setLoading(false)
      setShowModal(false)
    }
  }

  const handleJoinRequest = async () => {
    if (canRegisterDirectly()) {
      setShowModal(true)
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
    return
  }

  if (status === 'loading' || loading) {
    return <CircularProgress />
  }

  if (status === 'not_eligible') {
    return (
      <InfoPopup>
        {restrictionResult && (
          <Box>
            <Typography variant="h6">You do not meet the requirements to signup:</Typography>
            <List>
              {restrictionResult.map((reason, index) => (
                <ListItem key={index}>- {reason}</ListItem>
              ))}
            </List>
          </Box>
        )}
      </InfoPopup>
    )
  }

  return (
    <Box>
      {error && <p>{error}</p>}
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

      <MyModal showHide={showModal} onClose={() => setShowModal(false)} title="Confirm Signing up">
        <Typography>
          You are about to sign up.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="outlined" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSignUp} sx={{ ml: 2 }}>
            Sign Up!
          </Button>
        </Box>
      </MyModal>
    </Box>
  )
}

export default JoinRequest