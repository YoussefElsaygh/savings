"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import { signOutUser } from "@/lib/firebase";
import Image from "next/image";

interface GoogleSignInProps {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  onSignIn: () => Promise<void>;
}

export default function GoogleSignIn({
  user,
  isLoading,
  error,
  onSignIn,
}: GoogleSignInProps) {
  const [signingIn, setSigningIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await onSignIn();
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOutUser();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setSigningOut(false);
    }
  };

  // If user is signed in, show user info and sign out option
  if (user) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {user.photoURL && (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user.displayName || "User"}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            {signingOut ? "..." : "Sign Out"}
          </button>
        </div>
      </div>
    );
  }

  // If not signed in, show sign in interface
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm text-center">
      <div className="mb-4">
        <div className="text-3xl mb-2">🔐</div>
        <h2 className="text-lg font-semibold text-gray-900">
          Sign in Required
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Please sign in with Google to access your calorie tracking data
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={handleSignIn}
        disabled={signingIn || isLoading}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {signingIn || isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Signing in...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 mt-3">
        Your data will be securely stored and synced across all your devices
      </p>
    </div>
  );
}
