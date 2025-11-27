"use client";

import WeddingPage from "@/components/wedding/WeddingPage";
import AuthGuard from "@/components/shared/AuthGuard";

export default function WeddingPageContainer() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <WeddingPage />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

