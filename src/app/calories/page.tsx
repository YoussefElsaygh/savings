"use client";

import CaloriesTab from "@/components/CaloriesTab";
import Navbar from "@/components/Navbar";

export default function CaloriesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <CaloriesTab />
        </div>
      </div>
    </div>
  );
}
