import apiUrl from "config";
import { authAPI } from ".";

const notificationsUrl = apiUrl + 'notifications/';

const notificationAPI = {

  saveToken: function(token) {
    const requestOptions = authAPI.getRequestOptions('POST', {token: token});
    fetch(notificationsUrl + 'save-token', requestOptions)
  },

  // Get details of a specific notification
  getNotification: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET');
    const response = await fetch(notificationsUrl + id, requestOptions);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        error: 'Notification not found',
      };
    }
  },

  // Get all notifications for the user
  getAllNotifications: async function () {
    const requestOptions = authAPI.getRequestOptions('GET');
    const response = await fetch(notificationsUrl, requestOptions);

    if (response.ok) {
      const data = await response.json();
      return data.notifications;
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        error: 'Failed to fetch notifications',
      };
    }
  },

  // Create a new notification
  createNotification: async function (notificationData) {
    const requestOptions = authAPI.getRequestOptions('POST', notificationData);
    const response = await fetch(notificationsUrl + 'create', requestOptions);

    if (response.ok) {
      const data = await response.json();
      return { success: true, id: data.id };
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        error: 'Failed to create notification',
      };
    }
  },

  // Get the count of unread notifications
  getUnreadCount: async function () {
    const requestOptions = authAPI.getRequestOptions('GET');
    const response = await fetch(notificationsUrl + 'get-unread-count', requestOptions);

    if (response.ok) {
      const data = await response.json();
      return data.count;
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        error: 'Failed to get unread count',
      };
    }
  },

  // Mark a notification as read
  markAsRead: async function (id) {
    const requestOptions = authAPI.getRequestOptions('POST');
    const response = await fetch(`${notificationsUrl}${id}/read`, requestOptions);

    if (response.ok) {
      return { success: true };
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        error: 'Failed to mark notification as read',
      };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async function () {
    const requestOptions = authAPI.getRequestOptions('POST');
    const response = await fetch(notificationsUrl + 'mark-all-read', requestOptions);

    if (response.ok) {
      return { success: true };
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        error: 'Failed to mark all notifications as read',
      };
    }
  },

  // Delete a specific notification
  deleteNotification: async function (id) {
    const requestOptions = authAPI.getRequestOptions('DELETE');
    const response = await fetch(`${notificationsUrl}?id=${id}`, requestOptions);

    if (response.ok) {
      return { success: true };
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        error: 'Failed to delete notification',
      };
    }
  },

  // Delete all notifications
  deleteAllNotifications: async function () {
    const requestOptions = authAPI.getRequestOptions('DELETE');
    const response = await fetch(notificationsUrl + 'delete', requestOptions);

    if (response.ok) {
      return { success: true };
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        error: 'Failed to delete all notifications',
      };
    }
  },
};

export default notificationAPI;
