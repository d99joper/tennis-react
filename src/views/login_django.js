import { Flex } from '@aws-amplify/ui-react';
import { GoogleLogin } from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { authAPI, playerAPI } from 'api/services';

function Login() {

  
  function userLogin(e) {
    e.preventDefault()
    const form = new FormData(document.getElementById('loginForm'))
    const username = form.get("username")
    const pwd = form.get("password")
    console.log(username, pwd)
    authAPI.login(username, pwd)

  }

  return (
    <>
      <GoogleOAuthProvider clientId='107267563456-g2ceh5s5t31a5veq8j203rr7qtd00l41.apps.googleusercontent.com'>
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
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
        Username: <input id="username" />
        password: <input id="password" />
        <input type='submit' value="Go"/>
      </Flex>
    </>
  )
}

export default Login