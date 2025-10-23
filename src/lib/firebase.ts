import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";

// Your web app's Firebase configuration
// You'll need to replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyBSc0hC7sc6TBm-go81cXzHXIB2VWDDJ5Y",
  authDomain: "savings-b9cfc.firebaseapp.com",
  projectId: "savings-b9cfc",
  storageBucket: "savings-b9cfc.firebasestorage.app",
  messagingSenderId: "76977824120",
  appId: "1:76977824120:web:05a27bb9c282e9bbb6e88d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Check if on mobile device or PWA
const isMobileOrPWA = (): boolean => {
  if (typeof window === "undefined") return false;

  // Check if PWA
  const isPWA = window.matchMedia("(display-mode: standalone)").matches;
  if (isPWA) return true;

  // Check if mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) return true;

  // Check if small screen
  const isSmallScreen = window.innerWidth <= 768;
  return isSmallScreen;
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User | void> => {
  try {
    // Use redirect for mobile/PWA, popup for desktop
    if (isMobileOrPWA()) {
      console.log("Using redirect sign-in for mobile/PWA");
      // In mobile/PWA mode, use redirect (no return value, handled by getRedirectResult)
      await signInWithRedirect(auth, googleProvider);
    } else {
      console.log("Using popup sign-in for desktop");
      // In desktop mode, use popup
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export default app;
