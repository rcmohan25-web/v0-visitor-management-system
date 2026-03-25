import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAJJr0VWBYWPqVqTdIR5QsMAXVF--OETo4',
  authDomain: 'applicant-management-sysyem.firebaseapp.com',
  projectId: 'applicant-management-sysyem',
  storageBucket: 'applicant-management-sysyem.firebasestorage.app',
  messagingSenderId: '191081517648',
  appId: '1:191081517648:web:5b81feb11cbd731d2cf755',
  measurementId: 'G-248G02DPGK',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
