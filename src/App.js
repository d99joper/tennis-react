//import "@aws-amplify/ui-react/styles.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import MyRouter from './routes';
import { green, blue, red, purple } from '@mui/material/colors';
import { BrowserRouter } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import authAPI from 'api/auth';
import { ProfileImageProvider } from "components/forms";
import { requestNotificationPermission } from "./firebase/requestNotificationPermission";
import { setupNotificationListener } from "./firebase/notificationService";

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
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: '#fff', // Apply background color globally
            '&.Mui-focused': {
              backgroundColor: '#f9f9f9', // Optional: change color when focused
            },
          },
        },
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

  // request notification permission
  requestNotificationPermission();
  
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length > 0) {
        // Unregister all existing service workers
        registrations.forEach((registration) => {
          registration.unregister().then((success) => {
            if (success) {
              console.log("Old Service Worker unregistered.");
            }
          });
        });
      }
  
      // Register the new service worker
      navigator.serviceWorker
        .register(`${process.env.PUBLIC_URL}/firebase-messaging-sw.js`)  
      //.register('https://9vonq7kpti.execute-api.us-west-1.amazonaws.com/firebase-messaging-sw.js')
        .then((registration) => {
          console.log("New Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
  useEffect(() => {
    setupNotificationListener((notification) => {
      console.log("New notification:", notification);
      // Handle notification here (e.g., update UI or show a badge)
    });
  }, []); // Runs only once when the app loads

  useEffect(() => { // 

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