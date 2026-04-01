import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'demo-project',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? 'demo-app-id',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

