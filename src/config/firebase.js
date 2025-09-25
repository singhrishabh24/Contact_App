/** @format */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARdDlPdl3yPmocFhveQtjdzUa78sSLz_U",
  authDomain: "vite-contact-bb6dd.firebaseapp.com",
  projectId: "vite-contact-bb6dd",
  storageBucket: "vite-contact-bb6dd.firebasestorage.app",
  messagingSenderId: "565922967106",
  appId: "1:565922967106:web:fc0fd7064596f6ee3e47db",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
