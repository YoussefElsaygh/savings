"use client";

interface QuickActionsSectionProps {
  onOpenModal: () => void;
}

export default function QuickActionsSection({ onOpenModal }: QuickActionsSectionProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
      <h3 className="text-lg font-bold mb-4">Track Your Activity</h3>
      <button
        onClick={onOpenModal}
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
      >
        ➕ Add Food or Exercise
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Track what you eat or your workout sessions
      </p>
    </div>
  );
}
