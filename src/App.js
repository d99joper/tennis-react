import "@aws-amplify/ui-react/styles.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import MyRouter from './routes';
import Footer from './components/layout/footer';
import { green, blue, red, purple } from '@mui/material/colors';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/layout/header';
import { Box, CssBaseline } from '@mui/material';
import authAPI from 'api/auth';
import { ProfileImageProvider } from "components/forms";

function App() {
  let PrimaryMainTheme = createTheme({
    palette: {
      primary: {
        main: green[500],
        light: green[200],
        dark: green[700],
        //contrastText: purple
      }, // Primary color
      success: { main: '#edfdf0' },//
      divider: green[300],
      secondary: { main: '#edfdf0' }, // Secondary color
      login: { main: green[700], hover: green[300], text: '#FFF' },
      info: { main: blue[400]},
      submit: { main: green[500], hover: green[300] },
      ochre: {
        main: '#E3D026',
        light: '#E9DB5D',
        dark: '#A29415',
        contrastText: '#242105',
      },
      background: {
        default: '#edfdf0',
        secondary: blue[50], // Secondary background color
        success: blue[100],
        paper: green[100],
      },
    },
  });
  PrimaryMainTheme = createTheme(PrimaryMainTheme, {
    palette: {

      tennis: PrimaryMainTheme.palette.augmentColor({
        color: {
          main: '#a34',
        },
        background: { main: '#7AD' },
        name: 'tennis',
      }),
    }
  });

  const [isLoading, setLoading] = useState(true); // Loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({})

  useEffect(() => { // useEffect hook

    function handleLoginLogout(e) {
      console.log(e)
      getCurrentUser()
    }

    async function getCurrentUser() {
      try {
        // get the current user (it's okay if it's null)
        const user = authAPI.getCurrentUser()
        setCurrentUser(user)
        
        // check if there is a user and set the isLoggedIn flag
        const isSignedIn = typeof user === 'object' ? true : false
        setIsLoggedIn(isSignedIn)

        // loading complete
        setLoading(false)
      }
      catch (e) {
        console.log(e)
      }
    }
    getCurrentUser()

    // Register the event listeners for login and logout
    window.addEventListener("login", handleLoginLogout)
    window.addEventListener("logout", handleLoginLogout)

    // Unregister the event listeners when the component is unmounted
    return () => {
      window.removeEventListener("login", handleLoginLogout)
      window.removeEventListener("logout", handleLoginLogout)
    }

  }, [])

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
    )
  }

  return (
    <ProfileImageProvider>
      <Box className="App" id="app" sx={{ display: 'flex', flexDirection: 'column' }}>
        <CssBaseline />
        <ThemeProvider theme={PrimaryMainTheme}>
          <BrowserRouter>
            
              <MyRouter isLoggedIn={isLoggedIn} currentUser={currentUser} />
              {/* </main> */}
              
            {/* </Box> */}
          </BrowserRouter>
        </ThemeProvider>
      </Box>
    </ProfileImageProvider>
  )
}

export default App