// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0SnGLDfIy_B6qmG2uBcoPlcLjdRayIn8",
  authDomain: "taag-1f34c.firebaseapp.com",
  projectId: "taag-1f34c",
  storageBucket: "taag-1f34c.firebasestorage.app",
  messagingSenderId: "188033701558",
  appId: "1:188033701558:web:bad771af1b3fc5f745f817",
  measurementId: "G-PZ1FW0T6B8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
auth.settings.appVerificationDisabledForTesting = true;