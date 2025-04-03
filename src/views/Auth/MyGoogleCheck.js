import { authAPI, playerAPI } from "api/services";
import { enums } from "helpers";
import { useNavigate } from "react-router-dom";

const { GoogleOAuthProvider, GoogleLogin } = require("@react-oauth/google");
const { jwtDecode } = require("jwt-decode");

const GoogleCheckUser = ({mode, callback, toggleLoading, ... props}) => {

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
  console.log(mode)
  return (

    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        text={mode === enums.LOGIN_MODES.SIGN_UP ? 'signup_with' : 'signin'}
        context={mode === enums.LOGIN_MODES.SIGN_UP ? 'signup' : 'signin'}
        cancel_on_tap_outside={true}
        onSuccess={credentialResponse => {

          const decoded = jwtDecode(credentialResponse.credential);
          //console.log(decoded)
          const userData = {
            google_id: decoded.sub,      // Unique Google ID
            email: decoded.email,        // User's email
            first_name: decoded.given_name,
            last_name: decoded.family_name,
            picture: decoded.picture     // Profile picture if needed
          };
          if(toggleLoading)
            toggleLoading()
          // check if user exists
          playerAPI.checkGoogleUser(userData).then((data) => {
            // if it's a new user redirect for more information gathering
            //console.log(data)
            if(toggleLoading)
              toggleLoading()
            callback(data, credentialResponse)
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

  )
}

export default GoogleCheckUser