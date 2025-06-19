import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import MyRouter from './routes';
import { BrowserRouter } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { ProfileImageProvider } from "components/forms";
import { requestNotificationPermission } from "./firebase/requestNotificationPermission";
import { setupNotificationListener, onNotificationReceived, removeNotificationListener } from "./firebase/notificationService";
import { theme, PrimaryMainTheme } from 'theme_config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import default styles
import { AuthProvider } from 'contexts/AuthContext';
import { NotificationsProvider } from 'contexts/NotificationContext';
import { HelmetProvider } from "react-helmet-async";
import { SnackbarProvider } from 'contexts/snackbarContext';
import useAwardToast from 'helpers/useAwardsToast';

function App() {
  const originalTitle = useRef(document.title);
  const { showAward, AwardToast } = useAwardToast()

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
    console.log("📢 Calling setupNotificationListener()...");
    const unsubscribe = setupNotificationListener();

    // Handle notifications globally
    const handleNotification = (payload) => {
      console.log("Global notification received:", payload);

      const title = payload?.notification.title || "New Notification";
      const body = payload?.notification.body || "You have received a new message.";

      const type = payload?.data?.type; 
      console.log(type)

      if ((type === "badge" || type === "trophy")) {
        console.log('show award')
        showAward(type, title);
      }

      // ✅ Display a browser notification
      if (Notification.permission === "granted") {
        new Notification(title, { body });
      } else {
        console.warn("Notifications are blocked in the browser.");
      }

      // Display toast
      toast.info(`${title}`, {
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
      console.log("🛑 Cleaning up notification listener...");
      unsubscribe();
      removeNotificationListener(handleNotification);
    };
  }, []);

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
    <BrowserRouter>
      <HelmetProvider>
        <ProfileImageProvider>
          <Box className="App" id="app" sx={{ display: 'flex', flexDirection: 'column' }}>
            <ToastContainer />
            <CssBaseline />
            <ThemeProvider theme={theme}>
              <AuthProvider>
                <NotificationsProvider>
                  <SnackbarProvider>
                    <MyRouter />
                  </SnackbarProvider>
                </NotificationsProvider>
              </AuthProvider>
            </ThemeProvider>
            <AwardToast />
          </Box>
        </ProfileImageProvider>
      </HelmetProvider>
    </BrowserRouter>
  )
}

export default App