// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore'
import { getAnalytics } from "firebase/analytics";
import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3ba-sEbozPtDmLZ8gEasxC3MG65itHBs",
  authDomain: "swipe-67e91.firebaseapp.com",
  projectId: "swipe-67e91",
  storageBucket: "swipe-67e91.appspot.com",
  messagingSenderId: "535041992712",
  appId: "1:535041992712:web:e12ccd8544d6deee0d09bd",
  measurementId: "G-500EGW98CE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
