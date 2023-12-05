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
  const PrimaryMainTheme = createTheme({
    palette: {
      primary: {main: green[100]},
      success: blue,
      secondary: {main: purple[100]},
      login: {main: green[700], hover: green[300], text: '#FFF'},
      info: blue,
      submit: {main: green[100]},
      divider: green[300],
      background: {
        default: green[10],
        secondary: blue[10],
        success: blue[100],
        paper: green[100],
      }
    }
  });

  const [isLoading, setLoading] = useState(true); // Loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({ })

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
          <Header isLoggedIn={isLoggedIn} currentUser={currentUser}></Header>
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
            <MyRouter isLoggedIn={isLoggedIn} currentUser={currentUser} />
            {/* </main> */}
            <Footer>
            </Footer>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </Box>
    </ProfileImageProvider>
  )
}

export default App