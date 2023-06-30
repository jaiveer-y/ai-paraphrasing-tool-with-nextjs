// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, browserSessionPersistence, getAuth, setPersistence, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDI6f9qhIapnssN2r6xwzwyb7TZtKhpiC8",
  authDomain: "rephraser-5f6af.firebaseapp.com",
  projectId: "rephraser-5f6af",
  storageBucket: "rephraser-5f6af.appspot.com",
  messagingSenderId: "576999550631",
  appId: "1:576999550631:web:5f5a3fda497be0dd5ff582",
  measurementId: "G-QZJT52ES4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;