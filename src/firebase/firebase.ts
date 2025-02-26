import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth"; // If using Firebase Authentication
import { getFirestore } from "firebase/firestore"; // If using Firestore

const firebaseConfig = {
  apiKey: "AIzaSyA5WiwySl8d_aoHa4dm0NGNLtKOmFm862E",
  authDomain: "assetmanagement-0101.firebaseapp.com",
  projectId: "assetmanagement-0101",
  storageBucket: "assetmanagement-0101.firebasestorage.app",
  messagingSenderId: "1028720964203",
  appId: "1:1028720964203:web:9f07fce034977d3444772e",
  measurementId: "G-CQSY791FF5",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { app, auth, db };
