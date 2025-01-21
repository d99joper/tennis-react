import { useState, useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import notificationAPI from "api/services/notifications";
import { setupNotificationListener } from "firebase/notificationService";

const useNotifications = (pollingInterval = 10000) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);

  // Polling function
  const pollNotifications = async () => {
    try {
      const response = await notificationAPI.getAllNotifications();

      setNotifications(response.notifications);
      setNotificationCount(response.notifications.length);

    } catch (error) {
      console.error("Polling error:", error);
    }
  };

  // Firebase setup
  const setupFirebase = setupNotificationListener()

  // Combined logic
  useEffect(() => {
    const initializeNotifications = async () => {
      const firebaseSuccess = await setupFirebase();

      if (!firebaseSuccess) {
        console.log("Falling back to polling...");
        setIsPolling(true);
        const interval = setInterval(pollNotifications, pollingInterval);
        return () => clearInterval(interval); // Clean up interval on unmount
      }
    };

    initializeNotifications();
  }, [pollingInterval]);

  return { notifications, notificationCount, isPolling };
};

export default useNotifications;
