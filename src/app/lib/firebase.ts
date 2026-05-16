import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// WARNING: Hardcoding API keys is a security risk
// These values will be visible in your client-side code
const firebaseConfig = {
  apiKey: "AIzaSyCpJ7SWrHy-Wq3eOnnKywGxfndu-1A9P9w",
  authDomain: "sentiment-analysis-7f015.firebaseapp.com",
  projectId: "sentiment-analysis-7f015",
  storageBucket: "sentiment-analysis-7f015.firebasestorage.app",
  messagingSenderId: "808887655294",
  appId: "1:808887655294:web:2b2ee1511800598a4f712f",
  measurementId: "G-E1S1CT110L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
