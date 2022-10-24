import { Amplify, Hub, API } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";
import React, { useState, useEffect, Suspense, useRef  } from 'react';
import './App.css';
import awsconfig from './aws-exports';
import {helpers} from './helpers/helpers';
import MyRouter from './routes';
import {LocalStorage} from './services/';
import Footer from './views/footer';
import {
  createPlayer as createPlayerMutation,
  updatePlayer as updatePlayerMutation
} from "./graphql/mutations";

// const isLocalhost = Boolean(
//   window.location.hostname === "localhost" ||
//     // [::1] is the IPv6 localhost address.
//     window.location.hostname === "[::1]" ||
//     // 127.0.0.1/8 is considered localhost for IPv4.
//     window.location.hostname.match(
//       /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
//     )
// );

// // Assuming you have two redirect URIs, and the first is for production and second is for localhost
// const [
//   productionRedirectSignIn,
//   localRedirectSignIn
// ] = awsconfig.oauth.redirectSignIn.split(",");

// const [
//   productionRedirectSignOut,
//   localRedirectSignOut
// ] = awsconfig.oauth.redirectSignOut.split(",");

// console.log(isLocalhost ? localRedirectSignIn : productionRedirectSignIn);

// const updatedAwsConfig = {
//   ...awsconfig,
//   oauth: {
//     ...awsconfig.oauth,
//     redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
//     redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
//   }
// }

// Amplify.configure(updatedAwsConfig);
// console.log(awsconfig.oauth.redirectSignOut);

Amplify.configure(awsconfig);


let currentUser = null, testing = true;

function App() {


  const [isLoading, setLoading] = useState(true); // Loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const newUser = useRef(null);

  let newUser2 = null;

  useEffect(() => { // useEffect hook
    Hub.listen('auth', (data) => {
      console.log(data);
      switch (data.payload.event) {
        case 'signIn':
            console.log('user signed in');
            // set signed in status
            setIsLoggedIn(true);
            //if(newUser2) {
            if(newUser.current) {
              console.log('update user name');
              // update the user name for the new user just created
              try {
                API.graphql({
                  query: updatePlayerMutation,
                  variables: {
                    input: {
                        //id: newUser2,
                        id: newUser.current,
                        name: data.payload.data.attributes.name
                      },
                     conditions: {id: newUser.current}
                  }
                }).then((result) => {
                  console.log(result);
                  
                  // done, now reset the newUser flag
                  newUser.current = null;
                  //newUser2 = null;
                });
              }
              catch(e) {
                console.log(e);
              }
            }
            break;
        case 'confirmSignUp':
          console.log('user confirmed');
            break;
        case 'signUp':
          
            const userData = data.payload.data;
            console.log('user signed up');
            
            // create a new Player
            const loadData = {
              name: userData.user.username,
              email: userData.user.username,
              id: userData.userSub,
              userGUID: userData.userSub
            };
            
            try{
              API.graphql({
                query: createPlayerMutation,
                variables: { input: loadData },
              }).then((result) => {
                //setNewUser(result.data.createPlayer.id);
                newUser.current = result.data.createPlayer.id;
                //newUser2 = result.data.createPlayer.id;
              });
            }
            catch(e){
              console.error(e);
            }
            
            // set signed in status
            setIsLoggedIn(true);  
            break;
        case 'signOut':
            console.log('user signed out');
            setIsLoggedIn(false);
            break;
        case 'signIn_failure':
            console.log('user sign in failed');
            break;
        case 'configured':
            console.log('the Auth module is configured');
      }
    });

    //user check (perhaps this should be in a helper?)
    helpers.CheckIfSignedIn().then((isSignedIn) => {
      setIsLoggedIn(isSignedIn);
      var userStatus = (isSignedIn === true ? 'SignedIn' : 'NotSignedIn')
      //console.log(userStatus);
      if(userStatus === 'SignedIn') {
        helpers.getUserAttributes().then((data) => {
          currentUser = data;
          //console.log(currentUser);
        });    
      }
    });
    
    setLoading(false); //set loading state
  }, []);

  if (isLoading) {
    return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    }}>
      Loading the data {console.log("loading state")}
    </div>
  );
  }

  return (
    <div className="App">
      
      {/* {myRoutes} */}
      <MyRouter isLoggedIn={isLoggedIn} testing={testing} />

      <Suspense fallback={<div>Loading...</div>}>
        
        <div className="Content">
        
        {/* <h1>{isLoggedIn === true ? 'Hello ' + currentUser.name :"" } </h1> */}
        
        </div>
      </Suspense>
      <Footer></Footer>
    </div>
  );
}
  
export default App;