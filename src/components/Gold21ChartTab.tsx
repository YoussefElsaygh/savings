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
