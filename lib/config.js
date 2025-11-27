import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_RT1,
  authDomain: process.env.NEXT_PUBLIC_RT2,
  projectId: process.env.NEXT_PUBLIC_RT3,
  storageBucket: process.env.NEXT_PUBLIC_RT4,
  messagingSenderId: process.env.NEXT_PUBLIC_RT5,
  appId: process.env.NEXT_PUBLIC_RT6
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push, set, get, child };
