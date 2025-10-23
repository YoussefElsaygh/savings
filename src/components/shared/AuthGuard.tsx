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
        setSigningIn(true);
        try {
          await signInWithGoogle();
          // If successful, onAuthStateChanged will update the user
        } catch (error) {
          console.error("Sign in failed:", error);
          // Redirect to home on sign-in failure
          setRedirecting(true);
          router.replace("/");
        } finally {
          setSigningIn(false);
        }
      };
      attemptSignIn();
    }
  }, [loading, user, signingIn, redirecting, router]);

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
