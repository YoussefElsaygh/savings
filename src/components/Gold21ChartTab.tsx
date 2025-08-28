"use client";

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
  // Format data for chart - extract gold21Rate from allHistory
  const chartData = allHistory
    .filter((entry) => entry.gold21Rate && entry.gold21Rate > 0)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    .map((entry) => ({
      date: entry.timestamp.split("T")[0], // Extract date part
      price: entry.gold21Rate,
      formattedDate: new Date(entry.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
      }),
    }));

  // Calculate Y-axis domain for better zooming
  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const padding = Math.max(priceRange * 0.05, 1); // 5% padding or minimum 1 EGP
  const yAxisDomain = [Math.max(0, minPrice - padding), maxPrice + padding];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gold 21K Price Chart</h2>
        <div className="space-x-2"></div>
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
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
