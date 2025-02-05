import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBG4VQrOB-B0cgy7UYE-0qEHHdIvF0IGL4",
  authDomain: "ponnudurai-f909f.firebaseapp.com",
  projectId: "ponnudurai-f909f",
  storageBucket: "ponnudurai-f909f.firebasestorage.app",
  messagingSenderId: "5749737863",
  appId: "1:5749737863:web:6e27a5b79c945605116b22",
  measurementId: "G-YQC0XQ8D62",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
