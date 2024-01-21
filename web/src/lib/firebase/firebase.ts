import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDLeJBwJ3M8GbVI1ZKWnUVA_F4tRwduiYs',
    authDomain: 'bucket-store-2dd47.firebaseapp.com',
    projectId: 'bucket-store-2dd47',
    storageBucket: 'bucket-store-2dd47.appspot.com',
    messagingSenderId: '846827551834',
    appId: '1:846827551834:web:2ef539ab1ecccb6d32ac63',
    measurementId: 'G-3N3FGQEF6S'
};

const app = initializeApp(firebaseConfig);
export default app;

export const auth = getAuth(app);