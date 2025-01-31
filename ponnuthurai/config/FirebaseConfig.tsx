// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBG4VQrOB-B0cgy7UYE-0qEHHdIvF0IGL4",
  authDomain: "ponnudurai-f909f.firebaseapp.com",
  projectId: "ponnudurai-f909f",
  storageBucket: "ponnudurai-f909f.firebasestorage.app",
  messagingSenderId: "5749737863",
  appId: "1:5749737863:web:6e27a5b79c945605116b22",
  measurementId: "G-YQC0XQ8D62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)