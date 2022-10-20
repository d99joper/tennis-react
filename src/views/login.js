import { Authenticator, View } from '@aws-amplify/ui-react';
import { Amplify, Auth } from 'aws-amplify'; 

function Login() {
    return (
        <View 
            as="div"
            ariaLabel="View example"
            //backgroundColor="var(--amplify-colors-white)"
            //borderRadius="6px"
            //border="1px solid var(--amplify-colors-black)"
            //boxShadow="3px 3px 5px 6px var(--amplify-colors-neutral-60)"
            //color="var(--amplify-colors-blue-60)"
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