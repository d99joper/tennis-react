import React, { createContext, useContext, useState, useEffect } from "react";
import notificationAPI from "api/services/notifications";
import { onNotificationReceived, removeNotificationListener } from "../firebase/notificationService";
import { AuthContext } from "./AuthContext";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const {isLoggedIn} = useContext(AuthContext)

  // Fetch unread count
  const fetchNotificationCount = async () => {
    try {
      const count = await notificationAPI.getUnreadCount();
      setNotificationCount(count || 0);
    } catch (error) {
      console.error("Failed to fetch notification count:", error);
    }
  };

  // Fetch all notifications
  const fetchNotifications = async () => {
    console.log("Fetching notifications..."); // Check if this runs
    try {
      const data = await notificationAPI.getAllNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id, tempRead = false) => {
    try {
      await notificationAPI.markAsRead(id);

      let shouldDecrease = true;
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) => {
          if (n.id === id) {
            // If already tempRead, skip decreasing count
            if (n.tempRead || n.is_read) {
              shouldDecrease = false;
            }
            return tempRead
              ? { ...n, tempRead: true }
              : { ...n, is_read: true, tempRead: false };
          }
          return n;
        })
      );
      fetchNotificationCount();
      // Use a timeout to ensure `setNotifications` is applied before updating count
      // setTimeout(() => {
      //   if (shouldDecrease) {
      //     setNotificationCount((prev) => Math.max(prev - 1, 0));
      //   }
      // }, 0);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Delete a notification
  const deleteNotification = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);

      setNotifications((prevNotifications) => {
        // Remove the notification from the list
        return prevNotifications.filter((n) => n.id !== id);
      });
      fetchNotificationCount();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const updateNotification = (updatedNotification) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === updatedNotification.id ? updatedNotification : n
      )
    );
  };

  // Firebase listener
  useEffect(() => {
    const handleNotification = () => {
      fetchNotificationCount();
      fetchNotifications();
    };
    console.log('notificationContext isLoggedIn', isLoggedIn)
    if (isLoggedIn) {
      fetchNotificationCount();
      fetchNotifications();

      onNotificationReceived(handleNotification);
    }
    return () => {
      removeNotificationListener(handleNotification);
    };
  }, [isLoggedIn]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        notificationCount,
        markAsRead,
        deleteNotification,
        updateNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => useContext(NotificationsContext);
