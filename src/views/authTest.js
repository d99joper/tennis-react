import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify, Auth, signOut } from 'aws-amplify'; 
import { helpers } from '../helpers/helpers';


function AuthTest() {
    return (
        <Authenticator>
            <button onClick={helpers.signOut}>User signOut</button>
        </Authenticator>

         
    );
  }
  
  export default AuthTest;