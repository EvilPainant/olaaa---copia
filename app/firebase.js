import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyB2PPAEju9_eOSEaWglK6WnGKWVdeyEVjA",
  authDomain: "almacen-9ff3b.firebaseapp.com",
  projectId: "almacen-9ff3b",
  storageBucket: "almacen-9ff3b.firebasestorage.app",
  messagingSenderId: "538060293956",
  appId: "1:538060293956:web:4b627da0b7fa97caeaf911",
  measurementId: "G-RH1ZYGSX7S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)