import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDoKfvXG8cgggT9T21ac2jn-8EGZd3w0j0",
    authDomain: "present-6a81d.firebaseapp.com",
    databaseURL: "https://present-6a81d.firebaseio.com",
    projectId: "present-6a81d",
    storageBucket: "present-6a81d.appspot.com",
    messagingSenderId: "316339233918",
    appId: "1:316339233918:web:5d60c9ffc6aac35afde42f",
    measurementId: "G-9NXLMJFMQE"
};

firebase.initializeApp(firebaseConfig);


firebase.getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    })
};

export default firebase;