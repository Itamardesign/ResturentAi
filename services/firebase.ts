// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZKOBWhQUgHEKT1siMKhveSdGC-SrFICY",
  authDomain: "resturent-menu-c8259.firebaseapp.com",
  projectId: "resturent-menu-c8259",
  storageBucket: "resturent-menu-c8259.firebasestorage.app",
  messagingSenderId: "388968047150",
  appId: "1:388968047150:web:6441abf4d219641a60b5bf",
  measurementId: "G-JF6R4DXP0G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
