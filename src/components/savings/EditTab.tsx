"use client";

import { useState, useEffect } from "react";
import { SavingsData } from "@/types";

interface EditTabProps {
  savings: SavingsData;
  setSavings: (savings: SavingsData) => Promise<void>;
  onAfterSave?: () => void;
}

export default function EditTab({
  savings,
  setSavings,
  onAfterSave,
}: EditTabProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SavingsData>(savings);

  // Update form data when savings prop changes (on initial load)
  useEffect(() => {
    setFormData(savings);
  }, [savings]);

  const handleInputChange = (field: keyof SavingsData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData({ ...formData, [field]: numValue });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Save to Firebase
      await setSavings(formData);

      // Show confirmation
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);

      // Switch to calculate tab if callback provided
      if (onAfterSave) {
        onAfterSave();
      }
    } catch (error) {
      console.error('Error saving savings data:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Reset form to saved values
    setFormData(savings);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Your Savings</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="usd-amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              USD Amount ($)
            </label>
            <input
              type="number"
              id="usd-amount"
              step="0.01"
              placeholder="Enter USD amount"
              value={formData.usdAmount || ""}
              onChange={(e) => handleInputChange("usdAmount", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="egp-amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              EGP Amount (EGP)
            </label>
            <input
              type="number"
              id="egp-amount"
              step="0.01"
              placeholder="Enter EGP amount"
              value={formData.egpAmount || ""}
              onChange={(e) => handleInputChange("egpAmount", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="gold18-amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              18K Gold Amount (grams)
            </label>
            <input
              type="number"
              id="gold18-amount"
              step="0.01"
              placeholder="Enter 18K gold amount in grams"
              value={formData.gold18Amount || ""}
              onChange={(e) =>
                handleInputChange("gold18Amount", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="gold21-amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              21K Gold Amount (grams)
            </label>
            <input
              type="number"
              id="gold21-amount"
              step="0.01"
              placeholder="Enter 21K gold amount in grams"
              value={formData.gold21Amount || ""}
              onChange={(e) =>
                handleInputChange("gold21Amount", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="gold24-amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              24K Gold Amount (grams)
            </label>
            <input
              type="number"
              id="gold24-amount"
              step="0.01"
              placeholder="Enter 24K gold amount in grams"
              value={formData.gold24Amount || ""}
              onChange={(e) =>
                handleInputChange("gold24Amount", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Amounts'
            )}
          </button>
          <button
            onClick={handleReset}
            disabled={isSaving}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Reset
          </button>
        </div>

        {showConfirmation && (
          <p className="mt-2 text-green-600 font-medium">
            ✅ Savings saved successfully to Firebase!
          </p>
        )}
        
        {saveError && (
          <p className="mt-2 text-red-600 font-medium">
            ❌ Error: {saveError}
          </p>
        )}
      </div>
    </div>
  );
}
