
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBkSjcWPWvRtKPk5yfmYbAFSV6J6wVvLPg",
  authDomain: "task-manager-be17e.firebaseapp.com",
  projectId: "task-manager-be17e",
  storageBucket: "task-manager-be17e.firebasestorage.app",
  messagingSenderId: "107322209047",
  appId: "1:107322209047:web:8b899f14a857beea56fd52",
  measurementId: "G-PVG6TWRG37",
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };


