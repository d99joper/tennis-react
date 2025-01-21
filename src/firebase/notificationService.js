import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export const setupNotificationListener = (onNotification) => {
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);
    onNotification(payload);
  });

  return unsubscribe; // Return the unsubscribe function
};
