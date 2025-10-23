"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle } from "@/lib/firebase";
import LoadingScreen from "./LoadingScreen";
import { User } from "firebase/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser && !signingIn) {
        // User is not authenticated, attempt sign in
        setLoading(false);
      } else if (currentUser) {
        // User is authenticated
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [signingIn]);

  // Attempt to sign in if not authenticated
  useEffect(() => {
    if (!loading && !user && !signingIn && !redirecting) {
      const attemptSignIn = async () => {
        console.log(
          "🔐 AuthGuard: User not authenticated, attempting sign-in..."
        );
        console.log("📍 Current path:", pathname);
        setSigningIn(true);
        try {
          // Store the current path to redirect back after sign-in
          if (typeof window !== "undefined") {
            sessionStorage.setItem("authRedirectPath", pathname);
            console.log("💾 Stored redirect path in sessionStorage:", pathname);
          }
          console.log("🚀 Calling signInWithGoogle()...");
          await signInWithGoogle();
          console.log("✅ signInWithGoogle() completed (popup mode)");
          // In PWA mode, signInWithGoogle will redirect and not return here
          // In browser mode, if successful, onAuthStateChanged will update the user
        } catch (error: any) {
          console.error("❌ Sign in failed:", error.message);
          // Clear stored path on error
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("authRedirectPath");
            console.log("🗑️ Cleared redirect path from sessionStorage");
          }
          // Redirect to home on sign-in failure
          setRedirecting(true);
          console.log("🏠 Redirecting to home page...");
          router.replace("/");
        } finally {
          // Only set signingIn to false in browser mode
          // In PWA mode, the page will redirect and this won't execute
          setSigningIn(false);
        }
      };
      attemptSignIn();
    }
  }, [loading, user, signingIn, redirecting, router, pathname]);

  // Show loading while checking auth
  if (loading) {
    return <LoadingScreen tip="Checking authentication..." />;
  }

  // Show loading while signing in
  if (signingIn) {
    return <LoadingScreen tip="Signing you in..." />;
  }

  // Show nothing while redirecting or if no user
  if (redirecting || !user) {
    return null;
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
}
