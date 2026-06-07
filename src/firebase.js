import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDvEMdcw892jWafME2XKJt9nZL33SW2SIg",
  authDomain: "praana-b3b61.firebaseapp.com",
  databaseURL: "https://praana-b3b61-default-rtdb.firebaseio.com",
  projectId: "praana-b3b61",
  storageBucket: "praana-b3b61.firebasestorage.app",
  messagingSenderId: "159680925183",
  appId: "1:159680925183:web:0badfb40937fcf38faabca",
  measurementId: "G-1RWZ9HBNRL"
};

// Initialize Firebase safely (prevents duplicate app errors in Vite HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics safely
let analytics;
isSupported().then((yes) => yes ? analytics = getAnalytics(app) : null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { auth, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult, db, rtdb };
