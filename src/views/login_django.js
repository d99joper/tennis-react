import { GoogleLogin } from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google'

function Login() {

  const googleLogin = async (accesstoken) => {
    let res = await fetch("https://mytennis-space.uw.r.appspot.com/rest-auth/google/", {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer my-token'
      },
      body: JSON.stringify({access_token: accesstoken})
    })
    console.log(res);
    return await res.status;
  };

  return (
    <GoogleOAuthProvider clientId='107267563456-g2ceh5s5t31a5veq8j203rr7qtd00l41.apps.googleusercontent.com'>
      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
          googleLogin(credentialResponse.credential)
        }}
        onError={() => {
          console.log('Login Failed');
        }}
        useOneTap
      />
    </GoogleOAuthProvider>
  )
}

export default Login