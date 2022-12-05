import { Hub } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";
import React, { useState, useEffect, Suspense, useRef } from 'react';
import './App.css';
import { userFunctions } from './helpers/helpers';
import MyRouter from './routes';
import Footer from './views/footer';

function App(props) {

  const testing = useRef(false);
  const newUser = useRef(false);

  const [isLoading, setLoading] = useState(true); // Loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => { // useEffect hook
    Hub.listen('auth', (data) => {
      console.log(data);
      switch (data.payload.event) {
        case 'signIn':
          console.log('user signed in');
          // set signed in status
          setIsLoggedIn(true);

          // check if a new user was just created
          if (newUser.current) {
            // create a new Player
            userFunctions.createPlayerIfNotExist();
            newUser.current = false;
            window.location = '/Profile';
          }
          break;
        case 'confirmSignUp':
          console.log('user confirmed');
          break;
        case 'cognitoHostedUI':
          console.log('cognitoHostedUI');
          // check if external user exist as a 'Player'
          // If not, create 'Player'
          userFunctions.createPlayerIfNotExist().then(() => {
            window.location = '/Profile';
          });

          break;
        case 'signUp':
          console.log('user signed up');
          newUser.current = true;
          break;
        case 'signOut':
          console.log('user signed out');
          setIsLoggedIn(false);
          break;
        case 'signIn_failure':
          console.log('user sign in failed');
          setIsLoggedIn(false);
          break;
        case 'configured':
          console.log('the Auth module is configured');
      }
    });


    setLoading(false); //set loading state
  }, []);

  try {
    userFunctions.CheckIfSignedIn()
      .then((isSignedIn) => {
        setIsLoggedIn(isSignedIn);
      })
      .catch((e) => { console.log(e) });
  }
  catch (e) {
    console.log(e);
  }

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

      <Suspense fallback={<div>Loading...</div>}>

        <div className="Content">
          <MyRouter isLoggedIn={isLoggedIn} testing={testing} />
        </div>
      </Suspense>
      <Footer></Footer>
    </div>
  );
}

export default App;