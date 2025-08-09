"use client";

import { useState } from "react";
import { RateEntry } from "@/types";
import {
  formatDate,
  formatNumber,
  getComparisonClass,
  getComparisonIcon,
} from "@/lib/utils";

interface QuantityHistoryTabProps {
  quantityHistory: RateEntry[];
}

type SavingsType =
  | "usdAmount"
  | "egpAmount"
  | "gold18Amount"
  | "gold21Amount"
  | "gold24Amount";

interface SavingsTypeInfo {
  key: SavingsType;
  label: string;
  unit: string;
  icon: string;
}

const savingsTypes: SavingsTypeInfo[] = [
  { key: "usdAmount", label: "USD", unit: "$", icon: "💵" },
  { key: "egpAmount", label: "EGP", unit: "EGP", icon: "💰" },
  { key: "gold18Amount", label: "18K Gold", unit: "g", icon: "🥇" },
  { key: "gold21Amount", label: "21K Gold", unit: "g", icon: "🏆" },
  { key: "gold24Amount", label: "24K Gold", unit: "g", icon: "👑" },
];

export default function QuantityHistoryTab({
  quantityHistory,
}: QuantityHistoryTabProps) {
  const [selectedType, setSelectedType] = useState<SavingsType>(
    savingsTypes[0].key
  );

  if (quantityHistory.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Savings Quantity History</h2>
        <div className="text-center py-8 text-gray-500">
          No quantity history available. Save some savings amounts first.
        </div>
      </div>
    );
  }

  // Filter entries that have changes for the selected type
  const getFilteredEntries = (type: SavingsType) => {
    // For specific type, only show entries where that type changed
    return quantityHistory.filter((entry, index) => {
      if (index === quantityHistory.length - 1) return entry[type] > 0; // Show first entry if it has value

      const previousEntry = quantityHistory[index + 1];
      return entry[type] !== previousEntry[type];
    });
  };

  // Get comparison data for a specific type
  const getTypeComparison = (
    currentEntry: RateEntry,
    previousEntry: RateEntry | null,
    type: SavingsType
  ) => {
    const currentValue = currentEntry[type];
    const previousValue = previousEntry ? previousEntry[type] : 0;

    return {
      currentValue,
      previousValue,
      comparisonClass: getComparisonClass(currentValue, previousValue),
      comparisonIcon: getComparisonIcon(currentValue, previousValue),
      change: currentValue - previousValue,
    };
  };

  const filteredEntries = getFilteredEntries(selectedType);

  return (
    <div>
      <h2 id="test-id" className="text-2xl font-bold mb-6">
        Savings Quantity History
      </h2>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {savingsTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => setSelectedType(type.key)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedType === type.key
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No history found for the selected type.
        </div>
      ) : (
        <div className="space-y-4">
          {
            // Show timeline for specific type
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">
                  {savingsTypes.find((t) => t.key === selectedType)?.icon}
                </span>
                <h3 className="text-lg font-bold">
                  {savingsTypes.find((t) => t.key === selectedType)?.label}{" "}
                  Timeline
                </h3>
              </div>

              <div className="space-y-3">
                {filteredEntries.map((entry, index) => {
                  const previousEntry =
                    index < filteredEntries.length - 1
                      ? filteredEntries[index + 1]
                      : null;
                  const comparison = getTypeComparison(
                    entry,
                    previousEntry,
                    selectedType as SavingsType
                  );
                  const typeInfo = savingsTypes.find(
                    (t) => t.key === selectedType
                  )!;

                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {formatDate(entry.timestamp)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Entry #
                          {quantityHistory.length -
                            quantityHistory.findIndex((e) => e.id === entry.id)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold flex items-center gap-1 ${
                            comparison.comparisonClass || ""
                          }`}
                        >
                          {comparison.comparisonIcon &&
                            comparison.comparisonIcon !== "" && (
                              <span className="change-indicator">
                                {comparison.comparisonIcon}
                              </span>
                            )}
                          {formatNumber(comparison.currentValue)}{" "}
                          {typeInfo.unit}
                        </div>
                        {comparison.previousValue > 0 &&
                          comparison.change !== 0 && (
                            <div
                              className={`text-xs mt-1 ${
                                comparison.comparisonClass || ""
                              }`}
                            >
                              {comparison.change > 0 ? "+" : ""}
                              {formatNumber(comparison.change)} {typeInfo.unit}
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          }
        </div>
      )}
    </div>
  );
}
