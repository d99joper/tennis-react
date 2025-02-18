import React, { useContext, useEffect, useState } from 'react';
import { enums, helpers } from 'helpers';
import Wizard from 'components/forms/Wizard/Wizard';
import { Box, Button, CircularProgress, Container, Divider, TextField, Typography } from '@mui/material';
import { ClaimPlayer, UserInformation } from 'components/forms';
import authAPI from 'api/auth';
import { playerAPI } from 'api/services';
import { useNavigate } from 'react-router-dom';
import MyGoogleCheck from './MyGoogleCheck';
import MyModal from 'components/layout/MyModal';
import PlayerCard from 'components/forms/Player/playerCard';
import { AuthContext } from 'contexts/AuthContext';

const Registration = () => {

  const openPopup = (url, e) => {
    e.preventDefault()
    // Specify the size and other options for the popup
    const popupOptions = 'width=600,height=800,left=100,top=100,toolbar=no,scrollbars=yes,resizable=yes'

    // Open the popup window with the provided URL and options
    window.open(url, '_blank', popupOptions)
  }

  const navigate = useNavigate()
  const [showWizard, setShowWizard] = useState(false)
  const [showClaimDisplay, setShowClaimDisplay] = useState(false)
  const [showGoogleAdditionalInformation, setShowGoogleAdditionalInformation] = useState(false)
  const [showLoader, setShowLoader] = useState({ step0: false, step1: false, step2: false, step3: false })
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const [claimedPlayer, setClaimedPlayer] = useState(null);
  const [playersList, setPlayersList] = useState([]);
  const [regType, setRegType] = useState('email')

  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (password) {
      updateFormState('password', password);
    }
  }, [password]); // Runs whenever password changes
  
  const [formState, setFormState] = useState({
    data: {
      email: '',
      firstName: '',
      lastName: '',
      name: '',
      age: '',
      location: '',
    },
    errors: {
    },
  });
  const updateFormState = (key, value, isError = false) => {
    setFormState((prev) => ({
      ...prev,
      [isError ? 'errors' : 'data']: {
        ...prev[isError ? 'errors' : 'data'],
        [key]: value,
      },
    }));
  };
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        name: `${prev.data.firstName} ${prev.data.lastName}`.trim(),
      },
    }));
  }, [formState.data.firstName, formState.data.lastName]);

  const validateField = (key, value) => {
    if (key === 'email' && !helpers.validateEmail(value)) return 'Please provide a valid email.';
    if (key === 'firstName' && value.length < 1) return 'Please provide a longer name.';
    if (key === 'lastName' && value.length < 1) return 'Please provide a longer name.';
    if (key === 'age' && !helpers.hasValue(value)) return 'Please provide a birth year.';
    if (key === 'location' && !helpers.hasValue(value)) return 'Please provide a location.';
    return ''; // No error
  };

  const handleSubmit = () => {
    navigate('/login')
  }

  const errorCheck = () => {
    let newErrors = {};

    Object.keys(formState.data).forEach((key) => {
      const error = validateField(key, formState.data[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setFormState((prev) => ({
      ...prev,
      errors: newErrors,
    }));

    const hasErrors = Object.values(newErrors).some((error) => helpers.hasValue(error));
    console.log(newErrors, hasErrors);
    return hasErrors;
  };

  const handleGoogleRegistration = async () => {
    toggleLoader('step0')
    setRegType('google')

    const hasErrors = errorCheck();
    if (hasErrors) {
      toggleLoader('step0')
      return
    }
    // check if there's a claim
    try {
      if (helpers.hasValue(formState.data.claimedPlayer)) {
        console.log('there is a claim', formState.data.claimedPlayer)
        // claim the user
        await playerAPI.claimPlayer(formState.data.claimedPlayer.id, formState.data)
      }
      else {
        // create a new player
        console.log('there is no claim, create new player')
        await playerAPI.createPlayer(formState.data)
      }
    }
    catch (err) {
      console.log('Error: ' + err)
      toggleLoader('step0')
      return
    }

    //login and redirect
    await authAPI.googleLogin(formState.data.credentialResponse.credential).then((player) => {
      navigate("/players/" + player.id, { replace: false })
    })
    toggleLoader('step0')
  }

  const checkPasswords = () => {
    if (password.length < 8) {
      updateFormState('password', 'The password needs to be at least 8 characters', true)
      //setErrors((prevErrors) => ({ ...prevErrors, ['password']: 'The password needs to be at least 8 characters' }));
      return false;
    }
    if (password !== confirmPassword) {
      updateFormState('confirmPassword', 'Your passwords don\'t match.', true)
      //setErrors((prevErrors) => ({ ...prevErrors, ['confirmPassword']: 'Your passwords don\'t match.' }));
      return false;
    }
    return true; // passed the tests
  }

  const toggleLoader = (step) => {
    setShowLoader((prevState) => ({
      ...prevState,
      [step]: !prevState[step]  // Toggle the specific step's loader
    }));
  };

  const handleClaim = (p) => {
    setShowClaimDisplay(false)
    console.log('handleClaim',p)
    setClaimedPlayer(p)
    if (regType === 'google')
      setShowGoogleAdditionalInformation(true)
    if (helpers.hasValue(p)) {
      console.log('claimedPlayer', p)
      updateFormState('claimedPlayer', p)
      if (p.UTR)
        updateFormState('utr', p.UTR)
      if (p.NTRP)
        updateFormState('ntrp', p.NTRP)
      if (p.location) {
        updateFormState('location', p.location)
        updateFormState('lat', p.lat)
        updateFormState('lng', p.lng)
      }
    }
  }

  const handleGoogleAuth = (data, credentialResponse) => {
    setRegType('google')
    console.log(data)
    if (data.user_exists) {
      // user already exists, so login and redirect to profile page
      authAPI.googleLogin(credentialResponse.credential).then((user) => {
        navigate("/profile", { replace: false })
      })
    }
    // it's a new user
    else {
      updateFormState('email', data.player.email)
      updateFormState('firstName', data.player.firstName)
      updateFormState('lastName', data.player.lastName)
      updateFormState('google_id', data.player.google_id)
      updateFormState('picture', data.player.picture)
      updateFormState('credentialResponse', credentialResponse)

      // check if there are other users
      if (data.other_players?.length > 0) {
        setPlayersList(data.other_players)
        setShowClaimDisplay(true)
      }
      else {
        setShowGoogleAdditionalInformation(true)
      }
    }
  }

  const handleRegisterWithEmail = async (e) => {
    e.preventDefault();

    setRegType('email')

    const form = new FormData(document.forms.registrationForm)//document.getElementById('registrationForm'))
    const username = form.get("username")
    console.log(formState, username)
    if (!helpers.validateEmail(username)) {
      updateFormState('email', 'Please provide a valid email.', true)
      return;
    }

    toggleLoader('step0');
    const playerExists = await checkIfPlayerExists(username)
    toggleLoader('step0');
    if (playerExists === false) {
      setShowWizard(true)
      updateFormState('email', username)
    }
  }

  const checkIfPlayerExists = async (email) => {
    let playerExists = false;
    // check if the user email is already in use
    const player = await playerAPI.getPlayerByFilter(email)
    console.log(player)
    if (player.id) { // this player already exists.
      playerExists = true;
      // There should only be verified finds, 
      // but check if the email is verified
      //if (player.verified) {
      updateFormState('verified', (
        <>
          The email {player.email} is already in use and verified. <br />
          Try to either <a href="/login">login</a>, or to recover your password.
        </>
      ), true)
      //}
    }
    return playerExists;
  }

  const steps = [
    //step 1
    {
      label: 'User Details',
      content: (
        <Container maxWidth="sm">
          {!showLoader['step1'] &&
            // <CircularProgress />
            // :
            // <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={{ mt: 2 }}>
              <UserInformation
                formData={formState.data}
                errors={formState.errors}
                onUpdate={(key, value) => updateFormState(key, value)}
                onError={(key, error) => updateFormState(key, error, true)}
              />
              {claimedPlayer &&
                <Box sx={{ mb: 2, p: 1, bgcolor: "#FAFAFA" }}>
                  You are taking over this account.
                  <PlayerCard player={claimedPlayer} asLink={true} openToBlank={true} />
                </Box>
              }
              {/* {formState.data.claimedPlayer &&
                <Box display={'flex'} alignItems={'center'}>
                  You are merging with
                  <Link target="_blank" to={"/players" + formState.data.claimedPlayer.id}>
                    <ProfileImage player={formState.data.claimedPlayer} /> {formState.data.claimedPlayer.name}
                  </Link>
                </Box>
              } */}
            </Box>
          }
        </Container>
      ),
      handleNext: async () => {
        toggleLoader('step1')
        let hasErrors = errorCheck();
        // if there are any basic errors, return now before checking further
        if (hasErrors) {
          toggleLoader('step1')
          return !hasErrors;
        }

        console.log(formState)
        const playerEmailExists = await checkIfPlayerExists(formState.data.email)
        if (!playerEmailExists) {
          // check if the name exists with an unverified email nearby
          // if there are already existing players listed, then don't check again  
          if (!formState.errors.existingPlayers) {
            const result = await playerAPI.getPlayers({
              name: formState.data.name,
              geo: `${formState.data.lat}, ${formState.data.lng}, 150`, // lat,lng,radius
              email: '@mytennis.space', // it's a dummy email
              full: true
            })
            console.log(result.data)
            console.log(result.data.total_count)
            if (result.data.total_count > 0) {
              console.log('show claim display with ', result.data.players)
              hasErrors = true
              updateFormState('existingPlayers', 'There are existing players', true)
              setPlayersList(result.data.players)
              setShowClaimDisplay(true)
            }
          }
        }
        toggleLoader('step1')
        return !hasErrors;
      }
    },
    // Step 2
    {
      label: 'Email and password',
      description: 'Time to figure out a password.',
      content: (
        <Container maxWidth="sm">
          {showLoader['step2'] ?
            <CircularProgress />
            :
            <Box>
              {formState.data.email} {/* Display email as fixed text */}
              <br />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                onBlur={checkPasswords}
                required
                error={formState.errors.password && password === ''} // Show error if empty and there's an error
                helperText={formState.errors.password && password === '' ? 'Password is required' : ''}
                sx={{ mb: 3 }}
              />
              <TextField
                label="Confirm password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value) }}
                onBlur={checkPasswords}
                required
                error={formState.errors.confirmPassword && password !== confirmPassword} // Show error if passwords don't match
                helperText={formState.errors.confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
                sx={{ mb: 3 }}
              />
              {(formState.errors.claim || formState.errors.create || formState.errors.login) &&
                <Box>
                  {formState.errors.claim}
                  {formState.errors.create}
                  {formState.errors.login}
                </Box>
              }
            </Box>
          }
        </Container >
      ),
      handleNext: async () => {
        if (checkPasswords()) {
          // passwords cleared check
          updateFormState('password', password)
          //setFormData((prevData) => ({...prevData, 'password': password }))
          // start spinner/loader
          toggleLoader('step2')
          // if a profile has been claimed
          try {
            let playerId;
            console.log(claimedPlayer)
            if (claimedPlayer) {
              playerId = claimedPlayer.id
              const response = await playerAPI.claimPlayer(claimedPlayer.id, formState.data, password)
              if (response.status === 'error') {
                updateFormState('claim', response.message, true)
                return false
              }
            }
            else {
              const player = await playerAPI.createPlayer(formState.data);
              if (player?.error) {
                updateFormState('create', 'Failed to create user', true)
              }
              else
                playerId = player.id
            }
            authAPI.login(formState.data.email, password)
              .then((p) => {
                login(p);
                navigate("/players/" + playerId, { replace: false })
              })
              .catch((error) => {
                updateFormState('login', 'failed to login new user', true)
                authAPI.signOut()
              });
            return true;
          }
          catch (error) {
            throw error;
          }
          finally {
            console.log('toggle loader step2')
            toggleLoader('step2')
          }
        }
      }
    },
    // step 3 - last step
    {
      label: 'Success',
      description: 'You have successfully registered your account. ',
      // comment out verification for now, perhaps add later on
      // label: 'Verification',
      // description: 'To verify your email, follow the instructions in the verification email. After that you can log in to your account.',
      content: (
        <>
          {/* <TextField label="Code" /> */}
        </>
      ),
      disableBackButton: true
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',  // Adjust height as needed
        overflow: 'auto',  // Enables scrolling when content overflows
        maxHeight: '90vh', // Ensures it doesn't exceed viewport height
        width: '100%',  // Ensures it stretches fully
      }}
    >
      <Box
        sx={{
          width: 400,
          maxHeight: '100%',
          overflowY: 'auto',
          backgroundColor: '#fff',
          padding: 4,
          borderRadius: 2,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 2,
          }}
        >
          Sign up
        </Typography>

        {showLoader['step0'] ? (
          <CircularProgress />
        ) : (
          <>
            {!showWizard && !showGoogleAdditionalInformation && (
              <>
                <MyGoogleCheck callback={handleGoogleAuth} mode={enums.LOGIN_MODES.SIGN_UP} />

                <Divider sx={{ my: 2 }}>Or sign up with email</Divider>

                {/* Email and Password Form */}
                <Box
                  component="form"
                  name="registrationForm"
                  onSubmit={handleRegisterWithEmail}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <TextField
                    name="username"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                    helperText={formState.errors.email}
                    error={Boolean(formState.errors.email) && !helpers.validateEmail(formState.data.email)}
                  />
                  <span>{formState.errors.verified}</span>

                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Sign Up
                  </Button>
                </Box>
              </>
            )}

            {showWizard && (
              <Wizard
                steps={steps}
                content={
                  <Box>
                    <CircularProgress /> Logging you in ...
                    If you are not automatically logged in, go to login page
                  </Box>}
                submitText={'Go to Login'}
                handleSubmit={handleSubmit}
              />
            )}

            {showGoogleAdditionalInformation && (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {helpers.hasValue(formState.data.claimedPlayer) &&
                  <Box sx={{ mb: 2, p: 1, bgcolor: "#FAFAFA" }}>
                    You are taking over this account.
                    <PlayerCard player={formState.data.claimedPlayer} />
                    <Box sx={{ p: 2 }}>
                      Enhance your experience by sharing a few details about yourself.
                    </Box>
                  </Box>
                }
                <UserInformation
                  //onUpdate={handleChange}
                  onUpdate={(key, value) => updateFormState(key, value)}
                  onError={(key, error) => updateFormState(key, error, true)}
                  formData={formState.data}
                  errors={formState.errors}
                />
                <Button
                  sx={{ marginTop: '0.5rem' }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleGoogleRegistration}
                >
                  Sign Up
                </Button>
              </Box>
            )}

            <p>
              By registering, you agree to our{' '}
              <a href="/terms-of-service" onClick={(e) => openPopup('/terms-of-service', e)}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy-policy" onClick={(e) => openPopup('/privacy-policy', e)}>
                Privacy Policy
              </a>
              .
            </p>
          </>
        )}
      </Box>
      {/* Already exists information */}
      <MyModal
        showHide={showClaimDisplay}
        onClose={() => setShowClaimDisplay(false)}
        title="Unclaimed accounts"
        height="500px"
        overflow="auto"
      >

        <ClaimPlayer onClaim={handleClaim} players={playersList} />

      </MyModal>
    </Box>
  );
};

export default Registration;
