import { Hub } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { userFunctions } from './helpers/index';
import MyRouter from './routes';
import Footer from './views/footer';
import { green } from '@mui/material/colors';
import { BrowserRouter } from 'react-router-dom';

function App() {
  const PrimaryMainTheme = createTheme({
    palette: {
      // palette values for dark mode
      primary: green,
      divider: green[300],
      background: {
        default: green[10],
        paper: green[100],
      }

    }
  });
  const testing = useRef(false);
  const newUser = useRef(false);

  const [isLoading, setLoading] = useState(true); // Loading state
  const [doReload, setDoReload] = useState(false); // reload if new user is created
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({id:-1})
  const [navigateTo, setNavigateTo] = useState()

  useEffect(() => { // useEffect hook
    Hub.listen('auth', (data) => {
      console.log(data);
      switch (data.payload.event) {
        case 'signIn':
          console.log('user signed in');
          // set signed in status
          setIsLoggedIn(true)
          userFunctions.getCurrentlyLoggedInPlayer()
            .then((data) => {
              setCurrentUser(data)
              setNavigateTo('/profile/')
            }) 

          // check if a new user was just created
          if (newUser.current) {
            // create a new Player
            userFunctions.createPlayerIfNotExist().then(() => {
              newUser.current = false;
              setNavigateTo('/profile/')
              //window.location = '/Profile';
            })
          }
          break;
        case 'confirmSignUp':
          console.log('user confirmed');
          setNavigateTo('/profile/')
          break;
        case 'cognitoHostedUI':
          console.log('cognitoHostedUI');
          // check if external user exist as a 'Player'
          // If not, create 'Player'
          userFunctions.createPlayerIfNotExist().then(() => {
            setNavigateTo('/profile/')
           //window.location = '/Profile';
          });

          break;
        case 'signUp':
          console.log('user signed up');
          newUser.current = true;
          setNavigateTo('/profile/')
          break;
        case 'signOut':
          console.log('user signed out');
          setIsLoggedIn(false)
          setCurrentUser({}) //userFunctions.getCurrentlyLoggedInPlayer()
          break;
        case 'signIn_failure':
          console.log('user sign in failed');
          setIsLoggedIn(false)
          setCurrentUser({})
          break;
        case 'configured':
          console.log('the Auth module is configured');
          break;
        default: 
          break;
      }
    });

    async function getCurrentUser() {
      try {
        const isSignedIn = await userFunctions.CheckIfSignedIn()
        if(isSignedIn) {
          const user = await userFunctions.getCurrentlyLoggedInPlayer()
          setCurrentUser(user)
        }
        setIsLoggedIn(isSignedIn)
        setLoading(false); //set loading state
      }
      catch (e) {
        console.log(e);
      }
    }
    getCurrentUser()   

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
    <div className="App" id="app">
      <ThemeProvider theme={PrimaryMainTheme}>
        <BrowserRouter>
          <MyRouter isLoggedIn={isLoggedIn} testing={true} navigateTo={navigateTo} currentUser={currentUser} />
          <Footer></Footer>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;