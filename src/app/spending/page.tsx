"use client";

import SpendingPage from "@/components/spending/SpendingPage";
import AuthGuard from "@/components/shared/AuthGuard";

export default function SpendingPageContainer() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <SpendingPage />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
