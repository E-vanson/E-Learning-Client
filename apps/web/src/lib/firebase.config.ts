import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  inMemoryPersistence 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize with proper singleton pattern
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firebaseAuth = getAuth(firebaseApp);

// Set default persistence
if (typeof window !== 'undefined') { // Ensure client-side only
  setPersistence(firebaseAuth, browserLocalPersistence)
    .then(() => console.debug("Auth persistence initialized"))
    .catch((error) => console.error("Persistence error:", error));
}

export { firebaseApp, firebaseAuth };