// IMPORTANTE: Reemplazá con tu configuración de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDX7koFnRGzFPjH_InoyzqmIIKU-ZuCL8U",
  authDomain: "estrellitabarbershop-290ed.firebaseapp.com",
  projectId: "estrellitabarbershop-290ed",
  storageBucket: "estrellitabarbershop-290ed.firebasestorage.app",
  messagingSenderId: "610086743105",
  appId: "1:610086743105:web:fcbc532b67926c3e36aac0",
  measurementId: "G-TEM96CH6DT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
