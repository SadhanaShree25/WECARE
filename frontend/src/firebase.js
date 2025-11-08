// Paste your config object from the Firebase Console here

const firebaseConfig = {
  apiKey: "AIzaSyD5lqG3_ymCDjX4GPtR1JndNN95aUdYmQM",
  authDomain: "wecare-2eada.firebaseapp.com",
  projectId: "wecare-2eada",
  storageBucket: "wecare-2eada.firebasestorage.app",
  messagingSenderId: "557820806567",
  appId: "1:557820806567:web:ce65ab329788f9ea09e282"
};

// --- NO NEED TO EDIT BELOW THIS LINE ---
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app); // Initialize Cloud Functions

export { app, auth, db, functions };