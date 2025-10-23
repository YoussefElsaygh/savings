"use client";

import WorkoutPage from "@/components/workout/WorkoutPage";
import AuthGuard from "@/components/shared/AuthGuard";

export default function WorkoutPageContainer() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="p-4 sm:p-6 lg:p-8 ">
          <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <WorkoutPage />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
