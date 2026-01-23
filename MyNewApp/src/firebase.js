import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDd7PF64L_ytJFd7tW3BtKnQyLYP0U2_ss",
  authDomain: "fir-50767.firebaseapp.com",
  projectId: "fir-50767",
  storageBucket: "fir-50767.firebasestorage.app",
  messagingSenderId: "196881963121",
  appId: "1:196881963121:web:63e35fd05ba2addb1663d0"
};

// Google Sign-In Configuration
export const GOOGLE_SIGN_IN_KEY = '196881963121-oismb6gnhsmtdquvj0dsq3djomlf17l7.apps.googleusercontent.com';


// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
// Initialize Firebase Authentication
export const auth = getAuth(app);