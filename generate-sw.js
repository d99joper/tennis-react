const fs = require('fs');
// Use dotenv for local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const serviceWorkerContent = `
  importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-messaging-compat.js');

  const firebaseConfig = ${JSON.stringify(firebaseConfig)};
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
`;

fs.writeFileSync('public/firebase-messaging-sw.js', serviceWorkerContent);
console.log('Service worker generated successfully!');
