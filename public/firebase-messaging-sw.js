// Import Firebase scripts for messaging
importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js');

// Initialize Firebase app with your config
const firebaseConfig = {
  apiKey: "AIzaSyBspq-MVpXkxXgS_NFtDZny14ANbtvdqcw",
  authDomain: "mytennis-space.firebaseapp.com",
  projectId: "mytennis-space",
  storageBucket: "mytennis-space.firebasestorage.app",
  messagingSenderId: "107267563456",
  appId: "1:107267563456:web:10b7adfa95a974fe43f225",
  measurementId: "G-2F5E7ZW9TY",
};

firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
