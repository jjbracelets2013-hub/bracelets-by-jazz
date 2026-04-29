import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBqM7AmL4eRJWW8QI0CvphDJZBtEYYztuo",
  authDomain: "bracelets-by-jazz.firebaseapp.com",
  projectId: "bracelets-by-jazz",
  storageBucket: "bracelets-by-jazz.firebasestorage.app",
  messagingSenderId: "1033924415222",
  appId: "1:1033924415222:web:dfec7503ef5e90c0a2e6d7",
  measurementId: "G-175WYT5X9V"
};
const app = initializeApp(firebaseConfig);

export default app;
