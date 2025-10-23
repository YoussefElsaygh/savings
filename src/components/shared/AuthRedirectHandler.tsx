"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import LoadingScreen from "./LoadingScreen";

/**
 * Component to handle Firebase auth redirect results
 * This is needed for PWA mode where popup auth doesn't work
 */
export default function AuthRedirectHandler() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const handleRedirectResult = async () => {
      console.log("🔍 AuthRedirectHandler: Starting...");

      // Only show loading if we expect a redirect result
      const hasRedirectPath = sessionStorage.getItem("authRedirectPath");
      console.log("📍 Stored redirect path:", hasRedirectPath || "none");

      if (hasRedirectPath) {
        setProcessing(true);
      }

      try {
        console.log("⏳ Checking for redirect result from Firebase...");
        const result = await getRedirectResult(auth);

        if (result) {
          console.log("✅ Sign-in redirect successful!");
          console.log("👤 User:", result.user.email);
          console.log("🔑 User ID:", result.user.uid);

          // Check if there's a stored redirect path
          const redirectPath = sessionStorage.getItem("authRedirectPath");
          console.log("📍 Retrieved redirect path:", redirectPath || "none");

          if (redirectPath && redirectPath !== "/") {
            console.log("🚀 Redirecting to:", redirectPath);
            sessionStorage.removeItem("authRedirectPath");
            // Small delay to ensure auth state is propagated
            setTimeout(() => {
              console.log("✈️ Executing redirect now...");
              router.replace(redirectPath);
              setProcessing(false);
            }, 500);
          } else {
            console.log("🏠 No redirect needed, staying on current page");
            setProcessing(false);
          }
        } else {
          console.log(
            "ℹ️ No redirect result found (normal for regular page loads)"
          );
          setProcessing(false);
        }
      } catch (error: any) {
        console.error("❌ Error handling redirect result:");
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        console.error("Full error:", error);
        // Clear stored path on error
        sessionStorage.removeItem("authRedirectPath");
        setProcessing(false);
      }
    };

    handleRedirectResult();
  }, [router]);

  // Show loading screen while processing redirect result
  if (processing) {
    return <LoadingScreen tip="Completing sign-in..." />;
  }

  return null;
}
