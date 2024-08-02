'use client'
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCV7khBrC-rEwhAsSytPJYouWsVd0bgnxM",
    authDomain: "headstarter-pantry-app-1e5a0.firebaseapp.com",
    projectId: "headstarter-pantry-app-1e5a0",
    storageBucket: "headstarter-pantry-app-1e5a0.appspot.com",
    messagingSenderId: "733329815852",
    appId: "1:733329815852:web:f8b85d0723f8f6aacd5489",
    measurementId: "G-R2FZNGD6FS"
  };

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };
