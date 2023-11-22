import { Flex } from '@aws-amplify/ui-react'
import { GoogleLogin } from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { authAPI } from 'api/services'

function Login() {

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
  console.log(clientId)

  function userLogin(e) {
    e.preventDefault()
    const form = new FormData(document.getElementById('loginForm'))
    const username = form.get("username")
    const pwd = form.get("password")
    console.log(username, pwd)
    authAPI.login(username, pwd)
  }

  return (
    <Flex className='loginBox' direction={'column'} gap={'2rem'}>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            //console.log(credentialResponse);
            authAPI.googleLogin(credentialResponse.credential)
          }}
          onError={() => {
            console.log('Login Failed');
          }}
          useOneTap
        />
      </GoogleOAuthProvider>
      <Flex id="loginForm" direction={'column'} as="form"
        onSubmit={userLogin}>
        Username: <input name="username" />
        password: <input name="password" />
        <input type='submit' value="Go"/>
      </Flex>
    </Flex>
  )
}

export default Login