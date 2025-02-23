import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
const analytics = getAnalytics(app);
