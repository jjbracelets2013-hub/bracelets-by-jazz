import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "PASTE YOUR KEY",
  authDomain: "PASTE",
  projectId: "PASTE",
  storageBucket: "PASTE",
  messagingSenderId: "PASTE",
  appId: "PASTE"
};

const app = initializeApp(firebaseConfig);

export default app;
