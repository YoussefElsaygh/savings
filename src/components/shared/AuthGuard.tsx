"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import LoadingScreen from "./LoadingScreen";
import { User } from "firebase/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // User is not authenticated, redirect to home
        router.push("/");
      } else {
        // User is authenticated
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <LoadingScreen tip="Checking authentication..." />;
  }

  if (!user) {
    // This will show briefly before redirect happens
    return <LoadingScreen tip="Redirecting to home..." />;
  }

  return <>{children}</>;
}
