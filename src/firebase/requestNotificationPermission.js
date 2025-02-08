import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import notificationAPI from "api/services/notifications";
import authAPI from "api/auth";

export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (let registration of registrations) {
    console.log("Unregistering service worker:", registration);
    await registration.unregister();
  }
};
export const requestNotificationPermission = async () => {
  try {
    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) {
      console.log("User not logged in. Skipping notification setup.");
      return;
    }

    // Unregister existing service workers to prevent conflicts
    await unregisterServiceWorkers();
    
    // Ensure Service Worker is registered
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("Service Worker registered:", registration);

    const newToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (newToken) {
      console.log("Notification token:", newToken);

      const storedToken = localStorage.getItem("firebaseToken");

      if (storedToken !== newToken) {
        console.log("New token detected. Updating backend...");
        localStorage.setItem("firebaseToken", newToken);
        await notificationAPI.saveToken(newToken);
      } else {
        console.log("Token already up-to-date.");
      }
    } else {
      throw new Error("Firebase token unavailable");
    }
  } catch (error) {
    console.error("Firebase error:", error);
    return false;
  }
};

// Sync token when tab regains focus
window.addEventListener("focus", async () => {
  const storedToken = localStorage.getItem("firebaseToken");

  if (!storedToken) {
    console.log("No Firebase token found. Fetching new one...");
    await requestNotificationPermission();
  } else {
    console.log("Firebase token is already set. Skipping update.");
  }
});

// window.addEventListener("focus", async () => {
//   console.log("Tab focus detected. Checking for Firebase token updates...");
//   await requestNotificationPermission();
// });
