import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGBN6BzvJpc2ggXWKxaCCJBErMKuZ66rc",
  authDomain: "whatsgood-gnestrelado.firebaseapp.com",
  projectId: "whatsgood-gnestrelado",
  storageBucket: "whatsgood-gnestrelado.appspot.com",
  messagingSenderId: "391582906611",
  appId: "1:391582906611:web:bbacf37bb1b0b11bb01f86",
  measurementId: "G-CCPVBFYX0G",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export { auth, provider };
export default db;
