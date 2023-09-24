import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import {useState} from "react";


const firebaseConfig = {
    apiKey: "AIzaSyCkyhqpYE-fFT4tO1SZhQdnbXz5dRKyjgs",
    authDomain: "futballnyilvantarto-1aaba.firebaseapp.com",
    projectId: "futballnyilvantarto-1aaba",
    storageBucket: "futballnyilvantarto-1aaba.appspot.com",
    messagingSenderId: "926655767888",
    appId: "1:926655767888:web:9b96b5b49fd328b326b855",
    measurementId: "G-M40XW08HNQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleprovider = new GoogleAuthProvider();
export const database = getFirestore(app);
export const storage = getStorage(app);