import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import notificationAPI from "api/services/notifications";


export const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY, 
    });

    if (token) {
      console.log("Notification token:", token);
      // Send the token to your server for user-specific notifications
      notificationAPI.saveToken(token);
    } else {
      throw new Error("Firebase token unavailable");
    }
  } catch (error) {
    console.error("Firebase error:", error);
    return false; // Signal failure
  }
};
