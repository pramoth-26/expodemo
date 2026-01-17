import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDd7PF64L_ytJFd7tW3BtKnQyLYP0U2_ss",
  authDomain: "fir-50767.firebaseapp.com",
  projectId: "fir-50767",
  storageBucket: "fir-50767.firebasestorage.app",
  messagingSenderId: "196881963121",
  appId: "1:196881963121:web:63e35fd05ba2addb1663d0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
