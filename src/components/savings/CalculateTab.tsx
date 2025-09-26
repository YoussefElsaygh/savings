"use client";

import { useEffect, useState } from "react";
import { SavingsData, RateEntry } from "@/types";
import {
  formatNumber,
  formatSum,
  formatDate,
  getComparisonClass,
  getComparisonIcon,
  calculateHistorySum,
} from "@/lib/utils";

interface CalculateTabProps {
  savings: SavingsData;
  allHistory: RateEntry[];
  gold21Price?: number | undefined;
  setAllHistory: (history: RateEntry[]) => void;
  usdPrice?: number | undefined;
}

export default function CalculateTab({
  savings,
  allHistory,
  setAllHistory,
  gold21Price,
  usdPrice,
}: CalculateTabProps) {
  // Get last 5 entries for display
  const rateHistory = allHistory.slice(0, 5);
  const [usdRate, setUsdRate] = useState("");
  const [gold21Rate, setGold21Rate] = useState("");
  useEffect(() => {
    setGold21Rate(gold21Price?.toString() || "");
  }, [gold21Price]);
  useEffect(() => {
    setUsdRate(usdPrice?.toString() || "");
  }, [usdPrice]);
  const [result, setResult] = useState<{
    total: number;
    breakdown: {
      usd: number;
      egp: number;
      gold18: number;
      gold21: number;
      gold24: number;
    };
    comparison?: {
      previousTotal: number;
      comparisonClass: string;
      comparisonIcon: string;
    };
  } | null>(null);

  const calculateTotal = () => {
    const usdRateNum = Number(usdRate) || 0;
    const gold21RateNum = Number(gold21Rate) || 0;
    const gold18RateNum = gold21RateNum / 1.1667; // 18K is typically 75% of 21K
    const gold24RateNum = gold21RateNum / 0.875; // 24K is typically 114.3% of 21K

    const usdValue = savings.usdAmount * usdRateNum;
    const egpValue = savings.egpAmount;
    const gold18Value = savings.gold18Amount * gold18RateNum;
    const gold21Value = savings.gold21Amount * gold21RateNum;
    const gold24Value = savings.gold24Amount * gold24RateNum;

    const total = calculateHistorySum({
      usdAmount: savings.usdAmount,
      egpAmount: savings.egpAmount,
      gold18Amount: savings.gold18Amount,
      gold21Amount: savings.gold21Amount,
      gold24Amount: savings.gold24Amount,
      id: "",
      timestamp: "",
      usdRate: usdRateNum,
      gold18Rate: gold18RateNum,
      gold21Rate: gold21RateNum,
      gold24Rate: gold24RateNum,
      sum: 0,
    });

    // Get previous total for comparison (before adding the new entry)
    const previousTotal = allHistory.length > 0 ? allHistory[0].sum : 0;
    const comparisonClass = getComparisonClass(total, previousTotal);
    const comparisonIcon = getComparisonIcon(total, previousTotal);

    setResult({
      total,
      breakdown: {
        usd: usdValue,
        egp: egpValue,
        gold18: gold18Value,
        gold21: gold21Value,
        gold24: gold24Value,
      },
      comparison: {
        previousTotal,
        comparisonClass,
        comparisonIcon,
      },
    });

    // Add to rate history
    if (usdRateNum > 0 || gold21RateNum > 0) {
      const newEntry: RateEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        usdRate: usdRateNum,
        gold18Rate: gold18RateNum,
        gold21Rate: gold21RateNum,
        gold24Rate: gold24RateNum,
        sum: total,
        gold24Amount: savings.gold24Amount,
        gold18Amount: savings.gold18Amount,
        gold21Amount: savings.gold21Amount,
        egpAmount: savings.egpAmount,
        usdAmount: savings.usdAmount,
      };

      // Add to full history (allHistory contains everything)
      const updatedAllHistory = [newEntry, ...allHistory];
      setAllHistory(updatedAllHistory);
    }
  };

  const loadFromHistory = (entry: RateEntry) => {
    setUsdRate(entry.usdRate.toString());
    setGold21Rate(entry.gold21Rate.toString());
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Calculate Total Savings</h2>
      {/* Rate Input Forms */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div>
          <label
            htmlFor="usd-rate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            USD Exchange Rate (1 USD = ? EGP)
          </label>
          <input
            type="number"
            id="usd-rate"
            step="0.01"
            placeholder="Enter USD exchange rate"
            value={usdRate}
            onChange={(e) => setUsdRate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="gold21-rate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            21K Gold Price per gram (EGP)
          </label>
          <input
            type="number"
            id="gold21-rate"
            step="0.01"
            placeholder="Enter 21K gold price per gram"
            value={gold21Rate}
            onChange={(e) => setGold21Rate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        onClick={calculateTotal}
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition-colors mb-6"
      >
        Calculate Total Savings
      </button>

      {/* Results */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-3">
          <h3 className="text-lg font-bold mb-4">Calculation Results</h3>

          <div className="grid gap-3 mb-4">
            {savings.usdAmount > 0 && (
              <div className="flex justify-between">
                <span>USD ({formatNumber(savings.usdAmount)} $):</span>
                <span className="font-medium">
                  {formatNumber(result.breakdown.usd)} EGP
                </span>
              </div>
            )}
            {savings.egpAmount > 0 && (
              <div className="flex justify-between">
                <span>EGP ({formatNumber(savings.egpAmount)} EGP):</span>
                <span className="font-medium">
                  {formatNumber(result.breakdown.egp)} EGP
                </span>
              </div>
            )}
            {savings.gold18Amount > 0 && (
              <div className="flex justify-between">
                <span>18K Gold ({formatNumber(savings.gold18Amount)} g):</span>
                <span className="font-medium">
                  {formatNumber(result.breakdown.gold18)} EGP
                </span>
              </div>
            )}
            {savings.gold21Amount > 0 && (
              <div className="flex justify-between">
                <span>21K Gold ({formatNumber(savings.gold21Amount)} g):</span>
                <span className="font-medium">
                  {formatNumber(result.breakdown.gold21)} EGP
                </span>
              </div>
            )}
            {savings.gold24Amount > 0 && (
              <div className="flex justify-between">
                <span>24K Gold ({formatNumber(savings.gold24Amount)} g):</span>
                <span className="font-medium">
                  {formatNumber(result.breakdown.gold24)} EGP
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-green-300 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Value:</span>
              <div className="flex items-center gap-2">
                <span className={result.comparison?.comparisonClass || ""}>
                  {result.comparison?.comparisonIcon &&
                  result.comparison.comparisonIcon !== "" ? (
                    <span className="mr-1 font-bold">
                      {result.comparison.comparisonIcon}
                    </span>
                  ) : result.comparison?.previousTotal === 0 ? (
                    <span
                      className="mr-1 font-bold"
                      style={{ color: "#2563eb" }}
                      title="First calculation"
                    >
                      ✨
                    </span>
                  ) : null}
                  {formatSum(result.total)} EGP
                </span>
              </div>
            </div>

            {result.comparison?.previousTotal &&
              result.comparison.previousTotal > 0 && (
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Change from previous:</span>
                  <span
                    className={`font-medium ${
                      result.comparison?.comparisonClass || ""
                    }`}
                  >
                    {result.total > result.comparison.previousTotal ? "+" : ""}
                    {formatSum(
                      result.total - result.comparison.previousTotal
                    )}{" "}
                    EGP
                  </span>
                </div>
              )}
          </div>
        </div>
      )}
      {/* Rate History */}
      {rateHistory.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-gray-700">
              Last 5 Rate Entries
            </span>
          </div>
          <div className="space-y-2">
            {rateHistory.map((entry: RateEntry, index: number) => {
              const currentSum = calculateHistorySum(entry);
              const previousEntry =
                index < rateHistory.length - 1 ? rateHistory[index + 1] : null;
              const previousSum = previousEntry
                ? calculateHistorySum(previousEntry)
                : 0;
              const comparisonClass = getComparisonClass(
                currentSum,
                previousSum
              );

              const comparisonIcon = getComparisonIcon(currentSum, previousSum);

              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between bg-white p-3 rounded border cursor-pointer hover:bg-gray-50"
                  onClick={() => loadFromHistory(entry)}
                >
                  <div className="text-sm">
                    <div className="font-medium">
                      {formatDate(entry.timestamp)}
                    </div>
                    <div className="text-gray-600">
                      USD: {formatNumber(entry.usdRate)} | EGP:{" "}
                      {formatNumber(entry.egpAmount)} | Gold 18K:{" "}
                      {formatNumber(entry.gold18Rate)} | Gold 21K:{" "}
                      {formatNumber(entry.gold21Rate)} | Gold 24K:{" "}
                      {formatNumber(entry.gold24Rate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold flex items-center gap-1 ${
                        comparisonClass || ""
                      }`}
                    >
                      {comparisonIcon && comparisonIcon !== "" && (
                        <span className="change-indicator">
                          {comparisonIcon}
                        </span>
                      )}
                      {formatSum(currentSum)} EGP
                    </div>
                    {previousSum > 0 && (
                      <div className={`text-xs mt-1 ${comparisonClass || ""}`}>
                        {currentSum > previousSum ? "+" : ""}
                        {formatSum(currentSum - previousSum)} EGP
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
