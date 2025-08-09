"use client";

import { useState } from "react";
import { RateEntry, SavingsData } from "@/types";
import {
  formatDate,
  formatSum,
  formatNumber,
  calculateHistorySum,
  getComparisonClass,
  getComparisonIcon,
} from "@/lib/utils";

interface HistoryTabProps {
  allHistory: RateEntry[];
  setAllHistory: (history: RateEntry[]) => void;
  savings: SavingsData;
}

interface MonthGroup {
  monthName: string;
  entries: (RateEntry & { originalIndex: number })[];
}

interface MonthGroups {
  [key: string]: MonthGroup;
}

export default function HistoryTab({
  allHistory,
  setAllHistory,
  savings,
}: HistoryTabProps) {
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(
    new Set()
  );

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      setAllHistory([]);
    }
  };

  const deleteEntry = (index: number) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      const newHistory = allHistory.filter(
        (_: RateEntry, i: number) => i !== index
      );
      setAllHistory(newHistory);
    }
  };

  const toggleMonth = (monthKey: string) => {
    const newCollapsed = new Set(collapsedMonths);
    if (newCollapsed.has(monthKey)) {
      newCollapsed.delete(monthKey);
    } else {
      newCollapsed.add(monthKey);
    }
    setCollapsedMonths(newCollapsed);
  };

  if (allHistory.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Full Calculation History</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          No calculation history available. Calculate your savings first.
        </div>
      </div>
    );
  }

  // Group history by month
  const historyByMonth: MonthGroups = {};

  allHistory.forEach((entry: RateEntry, index: number) => {
    const date = new Date(entry.timestamp);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const monthName = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

    if (!historyByMonth[monthKey]) {
      historyByMonth[monthKey] = {
        monthName,
        entries: [],
      };
    }

    historyByMonth[monthKey].entries.push({
      ...entry,
      originalIndex: index,
    });
  });

  // Sort months from newest to oldest
  const sortedMonths = Object.keys(historyByMonth).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Full Calculation History</h2>
        <button
          onClick={clearHistory}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        {sortedMonths.map((monthKey) => {
          const monthData = historyByMonth[monthKey];
          const isCollapsed = collapsedMonths.has(monthKey);

          return (
            <div
              key={monthKey}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Month Header */}
              <div
                className={`bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between ${
                  isCollapsed ? "border-b-0" : "border-b border-gray-200"
                }`}
                onClick={() => toggleMonth(monthKey)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-mono text-sm">
                    {isCollapsed ? "▶" : "▼"}
                  </span>
                  <h3 className="font-semibold text-gray-800">
                    {monthData.monthName}
                  </h3>
                </div>
                <span className="text-sm text-gray-600">
                  ({monthData.entries.length} entries)
                </span>
              </div>

              {/* Month Entries */}
              {!isCollapsed && (
                <div className="p-4 space-y-3">
                  {monthData.entries.map((entry, index) => {
                    const currentSum = calculateHistorySum(entry, savings);
                    const previousEntry =
                      index < monthData.entries.length - 1
                        ? monthData.entries[index + 1]
                        : null;
                    const previousSum = previousEntry
                      ? calculateHistorySum(previousEntry, savings)
                      : 0;
                    const comparisonClass = getComparisonClass(
                      currentSum,
                      previousSum
                    );
                    const comparisonIcon = getComparisonIcon(
                      currentSum,
                      previousSum
                    );

                    return (
                      <div
                        key={entry.id}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-gray-800">
                              {formatDate(entry.timestamp)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              USD:{" "}
                              <strong>
                                {formatNumber(savings.usdAmount)} USD
                              </strong>
                              , EGP:{" "}
                              <strong>
                                {formatNumber(savings.egpAmount)} EGP
                              </strong>
                              , 18K:{" "}
                              <strong>
                                {formatNumber(savings.gold18Amount)}gm
                              </strong>
                              , 21K:{" "}
                              <strong>
                                {formatNumber(savings.gold21Amount)}gm
                              </strong>
                              , 24K:{" "}
                              <strong>
                                {formatNumber(savings.gold24Amount)}gm
                              </strong>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteEntry(entry.originalIndex)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>

                        <div className="grid gap-2 text-sm mb-3">
                          <div className="flex flex-wrap gap-4">
                            <span className="text-gray-600">
                              USD: {formatNumber(entry.usdRate)}
                            </span>
                            <span className="text-gray-600">
                              18K: {formatNumber(entry.gold18Rate)}
                            </span>
                            <span className="text-gray-600">
                              21K: {formatNumber(entry.gold21Rate)}
                            </span>
                            <span className="text-gray-600">
                              24K: {formatNumber(entry.gold21Rate / 0.875)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                          <span className="font-semibold">Total:</span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold text-lg ${
                                comparisonClass === "increase"
                                  ? "text-green-600"
                                  : comparisonClass === "decrease"
                                  ? "text-red-600"
                                  : "text-gray-800"
                              }`}
                            >
                              {formatSum(currentSum)} EGP
                            </span>
                            {comparisonIcon && (
                              <span
                                className={`text-sm font-bold ${
                                  comparisonClass === "increase"
                                    ? "text-green-600"
                                    : comparisonClass === "decrease"
                                    ? "text-red-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {comparisonIcon}
                              </span>
                            )}
                          </div>
                        </div>

                        {previousSum > 0 && (
                          <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>Change from previous:</span>
                            <span
                              className={`font-medium ${
                                comparisonClass === "increase"
                                  ? "text-green-600"
                                  : comparisonClass === "decrease"
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {currentSum > previousSum ? "+" : ""}
                              {formatSum(currentSum - previousSum)} EGP
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
