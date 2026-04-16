// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1sKUj1GXQ_ZUjpOtEgPNiFAEkufhQyQc",
  authDomain: "hacaritamaweb.firebaseapp.com",
  projectId: "hacaritamaweb",
  storageBucket: "hacaritamaweb.firebasestorage.app",
  messagingSenderId: "242966731479",
  appId: "1:242966731479:web:62c41bd1cfdcb8e2726e92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);