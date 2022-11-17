import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6CHEsDzTtbG_IKoVRgiU7TrVZFUJGX0M",
  authDomain: "whatsapp-clone-e75fd.firebaseapp.com",
  projectId: "whatsapp-clone-e75fd",
  storageBucket: "whatsapp-clone-e75fd.appspot.com",
  messagingSenderId: "308986002459",
  appId: "1:308986002459:web:f61e6b41c491c766934cbe",
  measurementId: "G-QGJLF5E6HG",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export { auth, provider };
export default db;
