//src/services/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEHqQWzfoZiQt8a0kpDj7uGWfw7p2IQjs",
  authDomain: "quota-jalvo-jbm.firebaseapp.com",
  projectId: "quota-jalvo-jbm",
  storageBucket: "quota-jalvo-jbm.firebasestorage.app",
  messagingSenderId: "697291908798",
  appId: "1:697291908798:web:4b3312ec4e67af8b4760ef",
  measurementId: "G-R746HZEEC0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);