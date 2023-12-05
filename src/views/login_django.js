import { Flex } from '@aws-amplify/ui-react'
import { GoogleLogin } from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { authAPI } from 'api/services'
import './login.css'
import { Button } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'

function Login(props) {

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  function userLogin(e) {
    e.preventDefault()
    const form = new FormData(document.getElementById('loginForm'))
    const username = form.get("username")
    const pwd = form.get("password")
    
    authAPI.login(username, pwd).then(() => {
      redirect()
    })
  }

  function redirect() {
    const redirectTo = searchParams.get("redirectTo")
    navigate(redirectTo == null ? "/" : redirectTo,{replace:true})
  }

  return (
    <Flex className='loginBox' direction={'column'} gap={'2rem'}>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            //console.log(credentialResponse);
            authAPI.googleLogin(credentialResponse.credential).then((user) =>
            {
              redirect()
            })
          }}
          onError={() => {
            console.log('Login Failed');
          }}
          // text="continue_with"
          theme="outline"
          //useOneTap
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
          Login
        </Button>
      </Flex>
    </Flex>
  )
}

export default Login