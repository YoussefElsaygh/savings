"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RateEntry } from "@/types";

interface Gold21ChartTabProps {
  currentGold21Price?: number;
  allHistory: RateEntry[];
}

export default function Gold21ChartTab({
  currentGold21Price,
  allHistory,
}: Gold21ChartTabProps) {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  // Set initial date range when data loads
  useEffect(() => {
    if (allHistory.length > 0 && !fromDate && !toDate) {
      const validEntries = allHistory.filter(
        (entry) => entry.gold21Rate && entry.gold21Rate > 0
      );
      if (validEntries.length > 0) {
        const dates = validEntries.map(
          (entry) => entry.timestamp.split("T")[0]
        );
        const minDate = Math.min(
          ...dates.map((date) => new Date(date).getTime())
        );
        const maxDate = Math.max(
          ...dates.map((date) => new Date(date).getTime())
        );

        setFromDate(new Date(minDate).toISOString().split("T")[0]);
        setToDate(new Date(maxDate).toISOString().split("T")[0]);
      }
    }
  }, [allHistory, fromDate, toDate]);

  // Format data for chart - extract gold21Rate from allHistory
  const allChartData = allHistory
    .filter((entry) => entry.gold21Rate && entry.gold21Rate > 0)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    .map((entry) => ({
      date: entry.timestamp.split("T")[0], // Extract date part
      price: entry.gold21Rate,
      timestamp: entry.timestamp,
      formattedDate: new Date(entry.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
      }),
    }));

  // Filter data based on date range
  const chartData = allChartData.filter((entry) => {
    if (!fromDate && !toDate) return true;

    const entryDate = new Date(entry.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && entryDate < from) return false;
    if (to && entryDate > to) return false;

    return true;
  });

  // AI Analysis Functions
  const calculateMovingAverage = (data: typeof chartData, period: number) => {
    if (data.length < period) return null;
    const recent = data.slice(-period);
    const sum = recent.reduce((acc, curr) => acc + curr.price, 0);
    return sum / period;
  };

  const calculateRSI = (data: typeof chartData, period: number = 14) => {
    if (data.length < period + 1) return null;

    const changes = data
      .slice(-period - 1)
      .map((curr, i, arr) => {
        if (i === 0) return 0;
        return curr.price - arr[i - 1].price;
      })
      .slice(1);

    const gains = changes.filter((c) => c > 0);
    const losses = changes.filter((c) => c < 0).map((l) => Math.abs(l));

    const avgGain =
      gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / period : 0;
    const avgLoss =
      losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / period : 0;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  };

  const calculateTrendStrength = (data: typeof chartData) => {
    if (data.length < 5) return { trend: "neutral", strength: 0 };

    const recent = data.slice(-5);
    const first = recent[0].price;
    const last = recent[recent.length - 1].price;
    const change = ((last - first) / first) * 100;

    let trend: "bullish" | "bearish" | "neutral";
    if (change > 1) trend = "bullish";
    else if (change < -1) trend = "bearish";
    else trend = "neutral";

    return { trend, strength: Math.abs(change) };
  };

  const getAIRecommendation = () => {
    if (chartData.length < 20) {
      return {
        action: "hold" as const,
        confidence: 0,
        reason: "Insufficient data for analysis",
        signals: [],
      };
    }

    const currentPrice = chartData[chartData.length - 1].price;
    const ma7 = calculateMovingAverage(chartData, 7);
    const ma20 = calculateMovingAverage(chartData, 20);
    const rsi = calculateRSI(chartData);
    const trend = calculateTrendStrength(chartData);

    let score = 0;
    const signals = [];

    // Moving Average Analysis
    if (ma7 && ma20) {
      if (currentPrice > ma7 && ma7 > ma20) {
        score += 2;
        signals.push("Price above short & long-term averages (Bullish)");
      } else if (currentPrice < ma7 && ma7 < ma20) {
        score -= 2;
        signals.push("Price below short & long-term averages (Bearish)");
      }
    }

    // RSI Analysis
    if (rsi !== null) {
      if (rsi < 30) {
        score += 1;
        signals.push(
          `RSI oversold (${rsi.toFixed(1)}) - Potential buy opportunity`
        );
      } else if (rsi > 70) {
        score -= 1;
        signals.push(
          `RSI overbought (${rsi.toFixed(1)}) - Potential sell opportunity`
        );
      }
    }

    // Trend Analysis
    if (trend.trend === "bullish" && trend.strength > 2) {
      score += 1;
      signals.push(`Strong upward trend (+${trend.strength.toFixed(1)}%)`);
    } else if (trend.trend === "bearish" && trend.strength > 2) {
      score -= 1;
      signals.push(`Strong downward trend (-${trend.strength.toFixed(1)}%)`);
    }

    // Support/Resistance
    const prices = chartData.map((d) => d.price);
    const support = Math.min(...prices.slice(-10));
    const resistance = Math.max(...prices.slice(-10));

    if (currentPrice <= support * 1.02) {
      score += 1;
      signals.push("Price near support level - Good buying opportunity");
    } else if (currentPrice >= resistance * 0.98) {
      score -= 1;
      signals.push("Price near resistance level - Consider selling");
    }

    let action: "buy" | "sell" | "hold";
    let confidence = Math.min(Math.abs(score) * 20, 85);

    if (score >= 2) {
      action = "buy";
    } else if (score <= -2) {
      action = "sell";
    } else {
      action = "hold";
      confidence = Math.max(60 - Math.abs(score) * 10, 30);
    }

    return { action, confidence, reason: signals.join(". "), signals };
  };

  const aiRecommendation = getAIRecommendation();

  // Calculate Y-axis domain for better zooming
  const prices = chartData.map((d) => d.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const priceRange = maxPrice - minPrice;
  const padding = Math.max(priceRange * 0.05, 1); // 5% padding or minimum 1 EGP
  const yAxisDomain =
    prices.length > 0
      ? [Math.max(0, minPrice - padding), maxPrice + padding]
      : [0, 100];

  // Reset date filters
  const resetFilters = () => {
    if (allChartData.length > 0) {
      const dates = allChartData.map((entry) => entry.date);
      const minDate = Math.min(
        ...dates.map((date) => new Date(date).getTime())
      );
      const maxDate = Math.max(
        ...dates.map((date) => new Date(date).getTime())
      );

      setFromDate(new Date(minDate).toISOString().split("T")[0]);
      setToDate(new Date(maxDate).toISOString().split("T")[0]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gold 21K Price Chart</h2>
        <div className="space-x-2"></div>
      </div>

      {/* Date Range Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="fromDate"
              className="text-sm font-medium text-gray-700"
            >
              From:
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="toDate"
              className="text-sm font-medium text-gray-700"
            >
              To:
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
          >
            Show All
          </button>
          <div className="text-sm text-gray-600">
            Showing {chartData.length} of {allChartData.length} data points
          </div>
        </div>
      </div>

      {/* AI Trading Recommendation */}
      {chartData.length > 5 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6 border border-purple-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                🤖 AI Trading Recommendation
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                ⚠️ For educational purposes only. Not financial advice. Always
                do your own research.
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                aiRecommendation.action === "buy"
                  ? "bg-green-100 text-green-800"
                  : aiRecommendation.action === "sell"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {aiRecommendation.action.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Recommendation
              </p>
              <p
                className={`text-lg font-bold ${
                  aiRecommendation.action === "buy"
                    ? "text-green-600"
                    : aiRecommendation.action === "sell"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {aiRecommendation.action === "buy" &&
                  "📈 BUY - Good buying opportunity"}
                {aiRecommendation.action === "sell" &&
                  "📉 SELL - Consider taking profits"}
                {aiRecommendation.action === "hold" &&
                  "⏸️ HOLD - Wait for better signals"}
              </p>
              <div className="mt-2">
                <p className="text-xs text-gray-600">Confidence Level</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full ${
                      aiRecommendation.confidence > 70
                        ? "bg-green-500"
                        : aiRecommendation.confidence > 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${aiRecommendation.confidence}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {aiRecommendation.confidence.toFixed(0)}%
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Analysis Signals
              </p>
              <div className="space-y-1 text-xs text-gray-600 max-h-24 overflow-y-auto">
                {aiRecommendation.signals.map((signal, index) => (
                  <div key={index} className="flex items-start gap-1">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>{signal}</span>
                  </div>
                ))}
                {aiRecommendation.signals.length === 0 && (
                  <p className="text-gray-500">No strong signals detected</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-purple-200">
            <p className="text-xs text-gray-500">
              💡 This analysis uses technical indicators including moving
              averages, RSI, trend analysis, and support/resistance levels.
              Market conditions can change rapidly. Always consider multiple
              factors before making investment decisions.
            </p>
          </div>
        </div>
      )}

      {currentGold21Price && (
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-800">
            Current Price
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {currentGold21Price?.toFixed(3)} EGP/gram
          </p>
        </div>
      )}

      {chartData.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">
            No price history available yet.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Price history will be automatically recorded when you visit the app
            and prices are fetched.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {chartData.length} price point
              {chartData.length !== 1 ? "s" : ""} over time
            </p>
          </div>

          <div style={{ width: "100%", height: "400px" }}>
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  domain={chartData.length > 0 ? yAxisDomain : undefined}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value.toFixed(2)} EGP`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${value.toFixed(3)} EGP/gram`,
                    "Price",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                  name="Gold 21K Price (EGP/gram)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {chartData.length > 1 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold text-blue-800">Highest Price</p>
                <p className="text-blue-600">
                  {Math.max(...chartData.map((d) => d.price)).toFixed(3)}{" "}
                  EGP/gram
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <p className="font-semibold text-red-800">Lowest Price</p>
                <p className="text-red-600">
                  {Math.min(...chartData.map((d) => d.price)).toFixed(3)}{" "}
                  EGP/gram
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="font-semibold text-yellow-800">Price Range</p>
                <p className="text-yellow-600">
                  {(
                    Math.max(...chartData.map((d) => d.price)) -
                    Math.min(...chartData.map((d) => d.price))
                  ).toFixed(3)}{" "}
                  EGP
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold text-green-800">Price Change</p>
                <p
                  className={`${
                    chartData[chartData.length - 1].price > chartData[0].price
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {chartData.length > 1
                    ? `${(
                        ((chartData[chartData.length - 1].price -
                          chartData[0].price) /
                          chartData[0].price) *
                        100
                      ).toFixed(2)}%`
                    : "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
