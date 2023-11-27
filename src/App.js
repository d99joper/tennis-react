import { Hub } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { userHelper } from './helpers/index';
import MyRouter from './routes';
import Footer from './components/layout/footer';
import { green, blue, red, purple } from '@mui/material/colors';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/layout/header';
import { Box, CssBaseline } from '@mui/material';
import MiniDrawer from 'components/layout/test';
import authAPI from 'api/auth';

function App() {
  const PrimaryMainTheme = createTheme({
    palette: {
      primary: {main: green[100]},
      success: blue,
      secondary: {main: purple[100]},
      login: {main: green[700], hover: green[300], text: '#FFF'},
      info: blue,
      divider: green[300],
      background: {
        default: green[10],
        secondary: blue[10],
        success: blue[100],
        paper: green[100],
      }

    }
  });
  const newUser = useRef(false);

  const [isLoading, setLoading] = useState(true); // Loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({ })// id: -1 })
  const [navigateTo, setNavigateTo] = useState()

  useEffect(() => { // useEffect hook
    Hub.listen('auth', (data) => {
      console.log(data);
      switch (data.payload.event) {
        case 'signIn':
          console.log('user signed in');
          // set signed in status
          setIsLoggedIn(true)
          userHelper.getCurrentlyLoggedInPlayer()
            .then((data) => {
              setCurrentUser(data)
              if (data.username)
                localStorage.setItem('username', data.username)
              if (data.id)
                localStorage.setItem('user_id', data.id)
              if (data.email)
                localStorage.setItem('user_email', data.username)

              setNavigateTo('/profile/')
            })

          // check if a new user was just created
          if (newUser.current) {
            // create a new Player
            userHelper.createPlayerIfNotExist().then(() => {
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
          userHelper.createPlayerIfNotExist().then(() => {
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
          setCurrentUser({}) //userHelper.getCurrentlyLoggedInPlayer()
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
        const user = authAPI.getCurrentUser()
        console.log(user)
        const isSignedIn = typeof user === 'object' ? true : false
        if (isSignedIn) {
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
    <Box className="App" id="app" sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <ThemeProvider theme={PrimaryMainTheme}>
        <BrowserRouter>
          <Header isLoggedIn={isLoggedIn} testing={true} navigateTo={navigateTo} currentUser={currentUser}></Header>
          <Box component="main" className='content'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              //backgroundColor: 'blueviolet',
              flexGrow: 1, p: 3,
              transition: 'flex-grow 0.2s ease',
              overflowX: 'hidden', // Hide overflowing content
            }}>
            {/* <main className='content'> */}
            {/* <MiniDrawer/> */}
            <MyRouter isLoggedIn={isLoggedIn} testing={true} navigateTo={navigateTo} currentUser={currentUser} />
            {/* </main> */}
            <Footer>
            </Footer>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </Box>
  );
}

export default App;