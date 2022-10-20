import { Amplify, Hub, API } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";
import React, { useState, useEffect, Suspense  } from 'react';
import './App.css';
import awsconfig from './aws-exports';
import {helpers} from './helpers/helpers';
import MyRouter from './routes';
import {LocalStorage} from './services/';
import Footer from './views/footer';
import {createPlayer as createPlayerMutation} from "./graphql/mutations";

Amplify.configure(awsconfig);


let currentUser = null, testing = true;

function App() {


  const [isLoading, setLoading] = useState(true); // Loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => { // useEffect hook
    
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signIn':
            console.log('user signed in');
            // set signed in status
            LocalStorage.set('isLoggedIn', true);
            setIsLoggedIn(true);
            // helpers.getUserAttributes().then((data) => {
            //   currentUser = data;
            //   console.log(currentUser);
            // });    
            //window.location.reload(false);
            break;
        case 'signUp':
            console.log('user signed up');
            
            // create a new Player
            const data = {
              name: data.name,
              email: data.email,
              userId: data.username
            };
            API.graphql({
              query: createPlayerMutation,
              variables: { input: data },
            });

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
        
        <h1>{isLoggedIn === true ? 'Hello ' + currentUser.name :"" } </h1>
        
        </div>
      </Suspense>
      <Footer></Footer>
    </div>
  );
}
  
export default App;