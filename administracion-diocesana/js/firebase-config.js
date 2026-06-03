import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBz6P4yX42lVP8oF9zr00BMvWxeXAYr4lU",
  authDomain: "administracion-diocesana.firebaseapp.com",
  projectId: "administracion-diocesana",
  storageBucket: "administracion-diocesana.firebasestorage.app",
  messagingSenderId: "647859390323",
  appId: "1:647859390323:web:cfaa5f13364bac16a76706"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
