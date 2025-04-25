// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const getFirebaseConfig = () => {
  // Use test values for Jest environment
  if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
    return {
      apiKey: "test-api-key",
      authDomain: "test-auth-domain",
      projectId: "test-project-id",
      storageBucket: "test-storage-bucket",
      messagingSenderId: "test-messaging-sender-id",
      appId: "test-app-id",
      measurementId: "test-measurement-id",
    };
  }

  // Use actual environment variables in development/production
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
};

export const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { app, auth, db, provider };
