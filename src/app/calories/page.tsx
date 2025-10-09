"use client";

import CaloriesPage from "@/components/calories/CaloriesPage";

export default function CaloriesPageContainer() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 sm:p-6 lg:p-8 ">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <CaloriesPage />
        </div>
      </div>
    </div>
  );
}
