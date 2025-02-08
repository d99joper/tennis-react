import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { EventEmitter } from "events";

// Create a centralized event emitter
const notificationEmitter = new EventEmitter();

// Set up the notification listener to emit events
export const setupNotificationListener = () => {
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);

    // Emit the notification payload to all listeners
    notificationEmitter.emit("notification", payload);
  });

  return unsubscribe; // Return the unsubscribe function
};

// Add a listener for notifications
export const onNotificationReceived = (callback) => {
  notificationEmitter.on("notification", callback);
};

// Remove a listener for notifications
export const removeNotificationListener = (callback) => {
  notificationEmitter.off("notification", callback);
};
