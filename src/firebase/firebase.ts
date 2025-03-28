import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; //Firebase Authentication Services
import { getFirestore } from "firebase/firestore"; //Firebase Database

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
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firestore database and get a reference to it
const db = getFirestore(app);
const storage = getStorage(app);
export { app, auth, db, storage };
