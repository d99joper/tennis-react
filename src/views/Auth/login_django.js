import { Flex } from '@aws-amplify/ui-react'
import { authAPI, playerAPI } from 'api/services'
import './login.css'
import { Box, Button, Divider, LinearProgress, TextField, Typography } from '@mui/material'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { enums } from 'helpers'
import { UserInformation } from 'components/forms'
import { useState } from 'react'
import MyGoogleCheck from './MyGoogleCheck';

function Login({ mode, ...props }) {

  const [errors, setErrors] = useState([])
  const [showLoader, setShowLoader] = useState(false)
  const [showGoogleRedirectMessage, setShowGoogleRedirectMessage] = useState('')
  const [userIsRegistered, setUserIsRegistered] = useState(false)
  const [location, setLocation] = useState('')
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
  const [player, setPlayer] = useState()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

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
    const pwd2 = form.get("confirm_password")
    const firstName = form.get("first_name")
    const lastName = form.get("last_name")

    // reset the errors array
    setErrors([])
    let errors = []
    // signup
    if (mode === enums.LOGIN_MODES.SIGN_UP) {
      // Check if name is provided
      if (!(firstName && lastName && username)) {
        errors.push(<>Please provide your name and email.</>)
        setErrors(errors)
      }
      // Check if passwords match
      else if (pwd !== pwd2) {
        // Passwords do not match - handle error or provide feedback
        errors.push(<>Passwords do not match. Please enter matching passwords.</>)
        setErrors(errors)
      }
      // else if (pwd.length < 8) {
      //   errors.push(<>Passwords do not match. Please enter matching passwords.</>)
      //   setErrors(errors)
      //  }
      else {
        // Passwords match - handle form submission logic
        authAPI.register(username, pwd, firstName, lastName, location).then((data) => {
          if (data?.errors) {
            let i = 0
            for (let key in data.errors) {
              if (data.errors.hasOwnProperty(key)) {
                console.log(key, data.errors[key])
                if (key === "500")
                  errors.push(<p key={`error_${i}_${key}`}>Something went wrong. Please contact an admin.</p>)
                else
                  errors.push(<p key={`error_${i}_${key}`}>{key}: {data.errors[key]}</p>)
                i++
              }
            }
          }
          else
            setUserIsRegistered(true)

          setErrors(errors)
        })
      }

    }
    // signin
    else {
      try {
        authAPI.login(username, pwd).then((user) => {
          // if the user doesn't have a name, go to the more information page
          console.log(user)
          if (!user.verified) {
            errors.push(
              <span key='login_error'>
                This user has not been verified. Please check your inbox for a verification email.
                <div>
                  <Button color={'info'} variant='contained' onClick={() => sendVerificationEmail(user.id)}>
                    Send new verification email
                  </Button>
                </div>
              </span>
            )
            setErrors(errors)
            authAPI.signOut()
          }
          else if (!(user.name || user.location))
            navigate('/profile-information')
          else
            redirect()
        })
      }
      catch (e) {
        console.log(e)
      }
    }
  }

  function handleLocationChange(geoPoint) {
    console.log('new place', geoPoint)
    setLocation(geoPoint)
  }

  function redirect(page) {

    if (page) {
      navigate(page, { replace: false })
    }
    else {
      const redirectTo = searchParams.get("redirectTo")
      if (redirectTo?.startsWith('profile') || redirectTo === 'search' || redirectTo === 'ladders')
        navigate(redirectTo, { replace: false })
      else
        navigate("/profile", { replace: false })
    }
  }

  const handleGoogleAuth = (data, credentialResponse) => {

    console.log(data)
    if (data.user_exists) {
      setShowLoader(true)
      // user already exists, so login and redirect to profile page
      authAPI.googleLogin(credentialResponse.credential).then((user) => {
        navigate("/profile", { replace: false })
      })
    }
    // it's a new user
    else {
      // message and offer redirect to registration page
      setShowGoogleRedirectMessage(true)
    }
  }

  if (userIsRegistered === true) {
    return (
      <>
        The user was successfully registered. The next step is to verify your account. An email should have been sent to your email. Please check your mailbox to verify your account.
      </>
    )
  }
  else
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
            Log In
          </Typography>

          
          {showLoader && <LinearProgress />}
          {/* Google Sign-In */}
          <MyGoogleCheck callback={handleGoogleAuth} mode={enums.LOGIN_MODES.SIGN_UP} />
          {showGoogleRedirectMessage &&
            <>
              Your google account is not registered with My Tennis Space. <br/>
              <Button 
                variant='contained' 
                component={Link} 
                to="/Registration"
              >
                Register
              </Button>
            </>
          }
          <Divider sx={{ my: 2 }}>Or log in with email</Divider>

          {/* Email and Password Form */}
          {!showAdditionalInfo &&
            <Box
              component="form"
              onSubmit={userLogin}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField name="username" label="Email" variant="outlined" fullWidth />
              <TextField name="password" label="Password" variant="outlined" type="password" fullWidth />
              <Button variant="contained" color="primary" fullWidth>
                Log In
              </Button>
            </Box>
          }
          {/* Additional information */}
          {showAdditionalInfo &&
            <Flex>
              <UserInformation player={player} />
            </Flex>
          }

          {/* Footer */}
          <Typography sx={{ textAlign: 'center', mt: 2 }}>
            <Link href="/forgot-password" underline="hover">
              Forgot your password?
            </Link>
          </Typography>
          <Typography sx={{ textAlign: 'center', mt: 1 }}>
            Don't have an account?{' '}
            <Link href="/sign-up" underline="hover">
              Sign up
            </Link>
          </Typography>
        </Box>

        
      </Box>


    )
}

export default Login