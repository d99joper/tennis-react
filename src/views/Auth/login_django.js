import { Flex } from '@aws-amplify/ui-react'
import { GoogleLogin } from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { authAPI } from 'api/services'
import './login.css'
import { Button } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { enums } from 'helpers'
import { ErrorHandler } from 'components/forms'
import { useState } from 'react'

function Login({ mode, ...props }) {

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

  const [errors, setErrors] = useState([])
  const [userIsRegistered, setUserIsRegistered] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

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
        authAPI.register(username, pwd, firstName, lastName).then((data) => {
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
          if (!user.verified) {
            errors.push('This user has not been verified. Please check your inbox for a verification email.')
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

  function redirect() {
    const redirectTo = searchParams.get("redirectTo")
    navigate(redirectTo == null ? "/" : redirectTo, { replace: true })
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
      <Flex className='loginBox' direction={'column'} gap={'2rem'}>
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            text={mode === enums.LOGIN_MODES.SIGN_UP ? 'signup_with' : 'signin_with'}
            context={mode === enums.LOGIN_MODES.SIGN_UP ? 'signup' : 'signin'}
            cancel_on_tap_outside={true}
            onSuccess={credentialResponse => {
              //console.log(credentialResponse);
              authAPI.googleLogin(credentialResponse.credential).then((user) => {
                redirect()
              })
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            // text="continue_with"
            theme="outline"
            useOneTap
          />
        </GoogleOAuthProvider>
        <Flex id="loginForm" direction={'column'} as="form"
          onSubmit={userLogin}>
          {mode === enums.LOGIN_MODES.SIGN_UP &&
            <>
              First name: <input name="first_name" placeholder='First name' />
              Last name: <input name="last_name" placeholder='Last name' />
            </>
          }
          Email: <input name="username" placeholder='Email' />
          Password: <input type="password" name="password" placeholder='Password' onChange={() => setErrors([])} />
          {mode === enums.LOGIN_MODES.SIGN_UP &&
            <>
              Confirm Password: <input type="password" name="confirm_password" placeholder='Confirm password' onChange={() => setErrors([])} />

            </>
          }
          <ErrorHandler error={errors} />

          <Button
            color='info'
            sx={
              {
                backgroundColor: 'login.main',
                color: 'login.text',
                ':hover': {
                  backgroundColor: 'login.hover',
                  //color: 'white'
                }
              }}
            variant='outlined'
            type='submit'
          >
            {mode === enums.LOGIN_MODES.SIGN_UP ? 'Sign up' : 'Login'}
          </Button>
        </Flex>
      </Flex>
    )
}

export default Login