import { Authenticator, View } from '@aws-amplify/ui-react';

function Login() {
    return (
        <View 
            as="div"
            ariaLabel="View example"
            height="100%"
            maxWidth="100%"
            padding="1rem"
            width="50rem">

            <Authenticator socialProviders={['amazon','facebook','google']}>
            
            </Authenticator>
        </View>
    );
  }

export default Login;