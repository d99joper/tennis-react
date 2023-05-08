import { Authenticator, View } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';

function Login() {

    const services = {
        async handleSignUp(formData) {
          let { username, password, attributes } = formData
          // 1. check if the attributes.name exists in the players table

          // 2. if it does exist, offer to merge/add these matches to your account
          // perhaps this should happen on your profile page
          // if a user wants to merge player matches, let admin know. 
          // once denied, add an asterix to the player name as (not verified)
          return Auth.signUp({
            username,
            password,
            attributes,
            autoSignIn: {
              enabled: true,
            },
          });
        },
        // async handleSignIn(formData) {
        //     let { username, password } = formData
        //     console.log("handleSignIn", formData)
        //     return 
        // },
        // async handleConfirmSignIn(formData) {
        //     let {user, code, mfaType} = formData
        //     console.log("handleConfirmSignIn", formData)
        //     return 
        // },
        // async handleConfirmSignUp(formData) {
        //     let {user, code} = formData
        //     console.log("handleConfirmSignUp", formData)
        //     return 
        // }
      };

    return (
        <View 
            as="div"
            ariaLabel="View example"
            height="100%"
            maxWidth="100%"
            padding="1rem"
            width="50rem">

            <Authenticator services={services} socialProviders={['amazon','facebook','google']}>
            
            </Authenticator>
        </View>
    );
  }

export default Login;