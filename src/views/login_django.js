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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  function userLogin(e) {
    e.preventDefault()
    const form = new FormData(document.getElementById('loginForm'))
    const username = form.get("username")
    const pwd = form.get("password")

    setErrors([])

    if (mode === enums.LOGIN_MODES.SIGN_UP) {
      authAPI.register(username, pwd).then((data) => {
        if (data?.errors) {
          let errors = []
          for (let err of data.errors.username)
            errors.push(<p>{err}</p>)
          for (let err of data.errors.email)
            errors.push(<p>{err}</p>)
          for (let err of data.errors.password1)
            errors.push(<p>{err}</p>)
          setErrors(errors)
          console.log(errors)
        }
        else
          navigate('/profile')
      })
    }
    else
      authAPI.login(username, pwd).then(() => {
        redirect()
      })
  }

  function redirect() {
    const redirectTo = searchParams.get("redirectTo")
    navigate(redirectTo == null ? "/" : redirectTo, { replace: true })
  }

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
        Email: <input name="username" placeholder='Email' />
        Password: <input type="password" name="password" placeholder='Password' />
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
      <ErrorHandler error={errors} />
    </Flex>
  )
}

export default Login