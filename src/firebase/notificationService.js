import { onMessage, getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import { EventEmitter } from "events";
import notificationAPI from "api/services/notifications";

// Create a centralized event emitter
const notificationEmitter = new EventEmitter();

// Function to update token if Firebase changes it
export const refreshFirebaseToken = async () => {
  try {
    const newToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    });

    const storedToken = localStorage.getItem("firebaseToken");

    if (newToken && newToken !== storedToken) {
      console.log("New Firebase token detected. Updating backend...");
      localStorage.setItem("firebaseToken", newToken);
      await notificationAPI.saveToken(newToken); // Send new token to backend
    }
  } catch (error) {
    console.error("Failed to refresh Firebase token:", error);
  }
};

// Set up the notification listener to emit events
export const setupNotificationListener = () => {
  console.log("🟡 Setting up Firebase notification listener...");

  const unsubscribe = onMessage(messaging, async (payload) => {
    console.log("✅ Message received in onMessage():", payload); // Check if this runs

    // Refresh token in case Firebase changed it
    await refreshFirebaseToken();

    // Emit the notification payload globally
    notificationEmitter.emit("notification", payload);
  });

  return unsubscribe;
};


// Add a listener for notifications
export const onNotificationReceived = (callback) => {
  notificationEmitter.on("notification", callback);
};

// Remove a listener for notifications
export const removeNotificationListener = (callback) => {
  notificationEmitter.off("notification", callback);
};
window.notificationEmitter = notificationEmitter;