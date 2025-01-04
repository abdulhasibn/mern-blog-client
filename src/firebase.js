// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-db292.firebaseapp.com",
  projectId: "mern-blog-db292",
  storageBucket: "mern-blog-db292.appspot.com",
  messagingSenderId: "302013947407",
  appId: "1:302013947407:web:a5f45889606a8f6b5b4d7a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
