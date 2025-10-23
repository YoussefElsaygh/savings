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

// Sign in with Google - use popup by default, fallback to redirect if popup fails
export const signInWithGoogle = async (): Promise<User | void> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    // If popup is blocked or fails, try redirect
    if (
      error.code === "auth/popup-blocked" ||
      error.code === "auth/popup-closed-by-user"
    ) {
      console.log("Popup blocked or closed, using redirect instead");
      await signInWithRedirect(auth, googleProvider);
      return;
    }
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
