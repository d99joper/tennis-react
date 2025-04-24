import { authAPI, playerAPI } from 'api/services'
import './login.css'
import { Box, Button, CircularProgress, Divider, LinearProgress, TextField, Typography } from '@mui/material'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { enums, helpers } from 'helpers'
import { UserInformation } from 'components/forms'
import { useContext, useEffect, useState } from 'react'
import MyGoogleCheck from './MyGoogleCheck';
import { AuthContext } from 'contexts/AuthContext'
import { updateFormWithPlayer, updateFormState, validateFormFields } from './googleLoginFlow'

function Login({ mode, ...props }) {

  const [errors, setErrors] = useState([])
  const [showLoader, setShowLoader] = useState(false)
  const [showGoogleRedirectMessage, setShowGoogleRedirectMessage] = useState('')
  const [userIsRegistered, setUserIsRegistered] = useState(false)
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
  const [player, setPlayer] = useState()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useContext(AuthContext);

  const [formState, setFormState] = useState({
    data: { email: '', firstName: '', lastName: '', name: '', age: '', location: '' },
    errors: {},
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

  // const validateField = (key, value) => {
  //   if (key === 'email' && !helpers.validateEmail(value)) return 'Please provide a valid email.';
  //   if (key === 'firstName' && value.length < 1) return 'Please provide a longer name.';
  //   if (key === 'lastName' && value.length < 1) return 'Please provide a longer name.';
  //   if (key === 'age' && !helpers.hasValue(value)) return 'Please provide a birth year.';
  //   if (key === 'location' && !helpers.hasValue(value)) return 'Please provide a location.';
  //   return ''; // No error
  // };

  function sendVerificationEmail(user) {
    playerAPI.sendVerificationEmail(user).then(() => {
      setErrors('Verification sent, check your email.')
    })
  }

  function userLogin(e) {
    e.preventDefault()
    // get the form values
    const form = new FormData(document.getElementById('loginForm'))
    const username = form.get("username")
    const pwd = form.get("password")

    // Basic email validation

    if (!helpers.validateEmail(username)) {
      setErrors([<span key="invalid_email" className="error">Invalid email address.</span>]);
      return;
    }

    // reset the errors array
    setErrors([])
    setShowLoader(true)
    authAPI.login(username, pwd)
      .then((player) => {
        // if the user doesn't have a name, go to the more information page
        console.log(player)
        // disable verification for now, perhaps add it back in if it becomes a problem later on
        // if (!user.verified) {
        //   errors.push(
        //     <span key='login_error' className='error'>
        //       This user has not been verified. Please check your inbox for a verification email.
        //       <Box sx={{p:2}}>
        //         <Button color={'info'} variant='contained' onClick={() => sendVerificationEmail(player.id)}>
        //           Send new verification email
        //         </Button>
        //       </Box>
        //     </span>
        //   )
        // }
        // else
        //  redirect()
        login(player);

        redirect(player.id)
      })
      .catch((error) => {
        console.log(error);
        setErrors([<span key="login_error" className="error">{error.message}</span>]);
        authAPI.signOut()
      })
      .finally(() => {
        setShowLoader(false);
      });
  }

  function redirect(id) {
    const redirectTo = searchParams.get("redirectTo");

    if (redirectTo && !redirectTo.includes("login") && !redirectTo.includes("registration")) {
      navigate(redirectTo, { replace: false });
    } else {
      navigate(`/players/${id}`, { replace: false });
    }
  }

  const handleGoogleAuth = (code) => {

    setShowLoader(true)
    // user already exists, so login and redirect to profile page
    //authAPI.googleLogin(credentialResponse.credential).then((user) => {
    authAPI.googleLogin(code).then((user) => {
      if (user.created) {
        console.log(user)
        setPlayer(user)
        updateFormWithPlayer(setFormState, user)
        setShowAdditionalInfo(true)
        //setShowGoogleRedirectMessage(true)
      }
      else {
        login(user)
        redirect(user.id)
      }
    }).catch((error) => {
      console.error('Google login failed:', error);
      setErrors([<span key="google_error">Google login failed. Try clearing cookies or use email login.</span>]);
      authAPI.signOut();
    }).finally(() => {
      setShowLoader(false)
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <Box
        sx={{
          width: 400,
          backgroundColor: '#fff',
          padding: 4,
          borderRadius: 2,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
          {showAdditionalInfo ? 'Additional Information' : 'Log In'}
        </Typography>


        {showLoader && <LinearProgress />}
        {/* Google Sign-In */}
        {!showAdditionalInfo && <MyGoogleCheck callback={handleGoogleAuth} mode={enums.LOGIN_MODES.SIGN_IN} />}
        {/* {showGoogleRedirectMessage &&
            <>
              Your google account is not registered with My Tennis Space. <br />
              <Button
                variant='contained'
                component={Link}
                to="/Registration"
              >
                Register
              </Button>
            </>
          } */}
        <Divider sx={{ my: 2 }}>{!showAdditionalInfo && 'Or log in with email'}</Divider>
        {errors}
        {/* Email and Password Form */}
        {!showAdditionalInfo &&
          <Box
            component="form"
            name="loginForm"
            id="loginForm"
            onSubmit={userLogin}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {showLoader ? <CircularProgress /> :
              (
                <>
                  <TextField name="username" label="Email" variant="outlined" fullWidth />
                  <TextField name="password" label="Password" variant="outlined" type="password" fullWidth />
                  <Button variant="contained" color="primary" fullWidth type='submit'>
                    Log In
                  </Button>
                </>
              )
            }
          </Box>
        }
        {/* Additional information */}
        {showAdditionalInfo &&
          <Box display={'flex'} flexDirection="column" gap={2}>
            We need some more information before you can log in
            <br />
            <div>{player.email}</div>
            <UserInformation
              formData={formState.data}
              errors={formState.errors}
              onUpdate={(key, value) => updateFormState(key, value)}
              onError={(key, error) => updateFormState(key, error, true)}
            />
            {showLoader ? <CircularProgress /> :
              <Button variant="contained" onClick={async () => {
                const { newErrors, hasErrors } = validateFormFields(formState)
                setFormState((prev) => ({ ...prev, errors: newErrors }))
                if (hasErrors) return
                try {
                  setShowLoader(true)
                  await playerAPI.createPlayer(formState.data)
                  login(formState.data.player)
                  navigate("/players/" + formState.data.player.id, { replace: false })
                } catch (err) {
                  console.error("Error saving additional info", err)
                  setErrors([<span key="update_error">Failed to save profile</span>])
                } finally {setShowLoader(false)}
              }}>
                Continue
              </Button>
            }
          </Box>
        }
        {/* Footer */}
        {!showAdditionalInfo &&
          <>
            <Typography sx={{ textAlign: 'center', mt: 2 }}>
              <Link to="/forgot-password" underline="hover">
                Forgot your password?
              </Link>
            </Typography>
            <Typography sx={{ textAlign: 'center', mt: 1 }}>
              Don't have an account?{' '}
              <Link to="/registration" underline="hover">
                Sign up
              </Link>
            </Typography>
          </>
        }
      </Box>

    </Box >


  )
}

export default Login