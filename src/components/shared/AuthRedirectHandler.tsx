"use client";

import { useEffect } from "react";
import { getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * Component to handle Firebase auth redirect results
 * This is needed for PWA mode where popup auth doesn't work
 */
export default function AuthRedirectHandler() {
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("✅ Sign-in successful:", result.user.email);
          // User is now signed in, onAuthStateChanged will handle the rest
        }
      } catch (error) {
        console.error("❌ Error handling sign-in redirect:", error);
      }
    };

    handleRedirectResult();
  }, []);

  // This component doesn't render anything
  return null;
}
