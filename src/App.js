//import "@aws-amplify/ui-react/styles.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import MyRouter from './routes';
import { BrowserRouter } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import authAPI from 'api/auth';
import { ProfileImageProvider } from "components/forms";
import { requestNotificationPermission } from "./firebase/requestNotificationPermission";
import { setupNotificationListener, onNotificationReceived, removeNotificationListener } from "./firebase/notificationService";
import { theme, PrimaryMainTheme } from 'theme_config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import default styles
import { AuthProvider } from 'contexts/AuthContext';
import { NotificationsProvider } from 'contexts/NotificationContext';

function App() {
  //const [isLoading, setLoading] = useState(true); // Loading state
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [currentUser, setCurrentUser] = useState({})
  const originalTitle = useRef(document.title);

  console.log('app is starting...')
  // request notification permission

  useEffect(() => {
    console.log("App.js: Setting up service worker and notification permissions");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then(() => console.log("Old service worker unregistered."));
        });

        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted.");
            setTimeout(() => {
              navigator.serviceWorker
                .register(`${process.env.PUBLIC_URL}/firebase-messaging-sw.js`)
                .then((registration) => {
                  console.log("Service Worker registered with scope:", registration.scope);
                })
                .catch((error) => {
                  console.error("Service Worker registration failed:", error);
                });
            }, 1000);
          } else {
            console.error("Notification permission denied.");
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    requestNotificationPermission();
    // Initialize notification listener
    const unsubscribe = setupNotificationListener();

    // Handle notifications globally
    const handleNotification = (payload) => {
      console.log("Global notification received:", payload);

      const title = payload?.notification.title || "New Notification";
      const body = payload?.notification.body || "You have received a new message.";

      // Display toast
      toast.info(`${title}: ${body}`, {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Update the tab title
      document.title = `New message - ${originalTitle.current}`;
      setTimeout(() => {
        document.title = originalTitle.current;
      }, 7000);
    };

    // Subscribe to notification events
    onNotificationReceived(handleNotification);

    return () => {
      // Cleanup listeners
      unsubscribe();
      removeNotificationListener(handleNotification);
    };
  }, []);

  // useEffect(() => { // 
  //   function handleLoginLogout(e) {
  //     console.log(e)
  //     getCurrentUser()
  //   }
  //   async function getCurrentUser() {
  //     try {
  //       // get the current user (it's okay if it's null)
  //       const user = authAPI.getCurrentUser()
  //       setCurrentUser(user)

  //       // check if there is a user and set the isLoggedIn flag
  //       const isSignedIn = typeof user === 'object' ? true : false
  //       setIsLoggedIn(isSignedIn)

  //       // loading complete
  //       setLoading(false)
  //     }
  //     catch (e) {
  //       console.log(e)
  //     }
  //   }
  //   getCurrentUser()

  //   // Register the event listeners for login and logout
  //   window.addEventListener("login", handleLoginLogout)
  //   window.addEventListener("logout", handleLoginLogout)

  //   // Unregister the event listeners when the component is unmounted
  //   return () => {
  //     window.removeEventListener("login", handleLoginLogout)
  //     window.removeEventListener("logout", handleLoginLogout)
  //   }

  // }, [])

  useEffect(() => {
    console.log("App.js: Mounted");
    return () => {
      console.log("App.js: Unmounted");
    };
  }, []);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <ProfileImageProvider>
      <Box className="App" id="app" sx={{ display: 'flex', flexDirection: 'column' }}>
        <ToastContainer />
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AuthProvider>
              <NotificationsProvider>
                {/* <MyRouter isLoggedIn={isLoggedIn} currentUser={currentUser} /> */}
                <MyRouter />
              </NotificationsProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </Box>
    </ProfileImageProvider>
  )
}

export default App