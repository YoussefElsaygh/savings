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
import {
  Card,
  Space,
  Typography,
  DatePicker,
  Button,
  Progress,
  Tag,
  Row,
  Col,
  Statistic,
  Empty,
} from "antd";
import {
  RobotOutlined,
  RiseOutlined,
  FallOutlined,
  ReloadOutlined,
  GoldOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

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

  const getAIRecommendation = () => {
    if (chartData.length < 10) {
      return {
        action: "hold" as const,
        confidence: 0,
        reason: "Insufficient data for analysis",
        signals: [],
      };
    }

    const currentPrice = chartData[chartData.length - 1].price;
    const allPrices = chartData.map((d) => d.price);

    // Calculate price percentiles
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;
    const pricePercentile = ((currentPrice - minPrice) / priceRange) * 100;

    // Calculate recent trend (last 3-5 data points)
    const recentData = chartData.slice(-Math.min(5, chartData.length));
    const recentTrend =
      recentData.length > 1
        ? ((recentData[recentData.length - 1].price - recentData[0].price) /
            recentData[0].price) *
          100
        : 0;

    let score = 0;
    const signals = [];

    // Primary Strategy: Buy Low, Sell High based on price percentiles
    if (pricePercentile <= 20) {
      // Price is in bottom 20% - Strong BUY signal
      score += 3;
      signals.push(
        `Price near historical lows (${pricePercentile.toFixed(
          1
        )}th percentile) - Excellent buying opportunity!`
      );
    } else if (pricePercentile <= 35) {
      // Price is in bottom 35% - BUY signal
      score += 2;
      signals.push(
        `Price below average (${pricePercentile.toFixed(
          1
        )}th percentile) - Good buying opportunity`
      );
    } else if (pricePercentile >= 80) {
      // Price is in top 20% - Strong SELL signal
      score -= 3;
      signals.push(
        `Price near historical highs (${pricePercentile.toFixed(
          1
        )}th percentile) - Excellent selling opportunity!`
      );
    } else if (pricePercentile >= 65) {
      // Price is in top 35% - SELL signal
      score -= 2;
      signals.push(
        `Price above average (${pricePercentile.toFixed(
          1
        )}th percentile) - Good selling opportunity`
      );
    }

    // Secondary: Recent momentum check (avoid catching falling knife or selling too early)
    if (recentTrend < -5) {
      // Strong downward momentum - be cautious about buying
      if (score > 0) {
        score -= 1;
        signals.push(
          `Recent sharp decline (${recentTrend.toFixed(
            1
          )}%) - Wait for stabilization before buying`
        );
      }
    } else if (recentTrend > 5) {
      // Strong upward momentum - be cautious about selling too early
      if (score < 0) {
        score += 1;
        signals.push(
          `Recent sharp rise (${recentTrend.toFixed(
            1
          )}%) - May continue higher, consider waiting`
        );
      }
    }

    // Volatility check - be more confident in stable markets
    const volatility = (priceRange / ((minPrice + maxPrice) / 2)) * 100;
    if (volatility < 10) {
      signals.push("Low volatility market - More reliable signals");
    } else if (volatility > 25) {
      signals.push("High volatility market - Exercise extra caution");
    }

    // Distance from extremes
    const distanceFromMin = ((currentPrice - minPrice) / minPrice) * 100;
    const distanceFromMax = ((maxPrice - currentPrice) / maxPrice) * 100;

    if (distanceFromMin < 5) {
      score += 1;
      signals.push(
        `Very close to historical minimum (+${distanceFromMin.toFixed(
          1
        )}% from lowest) - Prime buying level`
      );
    } else if (distanceFromMax < 5) {
      score -= 1;
      signals.push(
        `Very close to historical maximum (-${distanceFromMax.toFixed(
          1
        )}% from highest) - Prime selling level`
      );
    }

    // Determine final action and confidence
    let action: "buy" | "sell" | "hold";
    let confidence: number;

    if (score >= 3) {
      action = "buy";
      confidence = Math.min(85, 60 + score * 5);
    } else if (score <= -3) {
      action = "sell";
      confidence = Math.min(85, 60 + Math.abs(score) * 5);
    } else if (score >= 1) {
      action = "buy";
      confidence = Math.min(75, 45 + score * 10);
    } else if (score <= -1) {
      action = "sell";
      confidence = Math.min(75, 45 + Math.abs(score) * 10);
    } else {
      action = "hold";
      confidence = 40;
      signals.push("Price in neutral zone - Wait for better opportunities");
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
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={2}>
          <GoldOutlined style={{ color: "#faad14" }} /> Gold 21K Price Chart
        </Title>
        <Text type="secondary">
          Track and analyze gold price trends over time
        </Text>
      </div>

      {/* Date Range Filters */}
      <Card size="small">
        <Space wrap align="center">
          <Text strong>Date Range:</Text>
          <RangePicker
            value={fromDate && toDate ? [dayjs(fromDate), dayjs(toDate)] : null}
            onChange={(dates) => {
              if (dates) {
                setFromDate(dates[0]?.format("YYYY-MM-DD") || "");
                setToDate(dates[1]?.format("YYYY-MM-DD") || "");
              }
            }}
          />
          <Button icon={<ReloadOutlined />} onClick={resetFilters}>
            Show All
          </Button>
          <Text type="secondary">
            Showing {chartData.length} of {allChartData.length} data points
          </Text>
        </Space>
      </Card>

      {/* AI Trading Recommendation */}
      {chartData.length > 5 && (
        <Card
          style={{
            background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
            borderColor: "#c4b5fd",
          }}
          title={
            <Space>
              <RobotOutlined style={{ fontSize: "20px" }} />
              <span>AI Trading Recommendation</span>
              <Tag
                color={
                  aiRecommendation.action === "buy"
                    ? "success"
                    : aiRecommendation.action === "sell"
                    ? "error"
                    : "warning"
                }
              >
                {aiRecommendation.action.toUpperCase()}
              </Tag>
            </Space>
          }
          extra={
            <Text type="secondary" style={{ fontSize: "11px" }}>
              ⚠️ Educational only. Not financial advice.
            </Text>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text strong>Recommendation</Text>
                <Text
                  style={{
                    fontSize: "16px",
                    color:
                      aiRecommendation.action === "buy"
                        ? "#52c41a"
                        : aiRecommendation.action === "sell"
                        ? "#ff4d4f"
                        : "#faad14",
                  }}
                >
                  {aiRecommendation.action === "buy" &&
                    "📈 BUY - Price is relatively low, good time to buy"}
                  {aiRecommendation.action === "sell" &&
                    "📉 SELL - Price is relatively high, good time to sell"}
                  {aiRecommendation.action === "hold" &&
                    "⏸️ HOLD - Price in neutral zone, wait for extremes"}
                </Text>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Confidence Level
                  </Text>
                  <Progress
                    percent={aiRecommendation.confidence}
                    strokeColor={
                      aiRecommendation.confidence > 70
                        ? "#52c41a"
                        : aiRecommendation.confidence > 50
                        ? "#faad14"
                        : "#ff4d4f"
                    }
                    size="small"
                  />
                </div>
              </Space>
            </Col>

            <Col xs={24} md={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text strong>Analysis Signals</Text>
                <div style={{ maxHeight: "120px", overflowY: "auto" }}>
                  {aiRecommendation.signals.map((signal, index) => (
                    <Text
                      key={index}
                      type="secondary"
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      • {signal}
                    </Text>
                  ))}
                  {aiRecommendation.signals.length === 0 && (
                    <Text type="secondary">No strong signals detected</Text>
                  )}
                </div>
              </Space>
            </Col>
          </Row>

          <div
            style={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: "1px solid #e0d9ff",
            }}
          >
            <Text type="secondary" style={{ fontSize: "11px" }}>
              💡 This analysis uses a &quot;buy low, sell high&quot; strategy based on
              historical price percentiles and recent momentum. It identifies
              when prices are near historical lows (buy opportunities) or highs
              (sell opportunities). Market conditions can change rapidly. Always
              consider multiple factors before making investment decisions.
            </Text>
          </div>
        </Card>
      )}

      {currentGold21Price && (
        <Card>
          <Statistic
            title="Current Gold Price"
            value={currentGold21Price.toFixed(3)}
            suffix="EGP/gram"
            prefix={<GoldOutlined style={{ color: "#faad14" }} />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      )}

      {chartData.length === 0 ? (
        <Empty
          description={
            <Space direction="vertical">
              <Text>No price history available yet.</Text>
              <Text type="secondary" style={{ fontSize: "13px" }}>
                Price history will be automatically recorded when you visit the
                app and prices are fetched.
              </Text>
            </Space>
          }
          style={{ padding: "60px 0" }}
        />
      ) : (
        <Card>
          <Text
            type="secondary"
            style={{ display: "block", marginBottom: "16px" }}
          >
            Showing {chartData.length} price point
            {chartData.length !== 1 ? "s" : ""} over time
          </Text>

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
                  formatter={(value) => {
                    if (typeof value === "number") {
                      return [`${value.toFixed(3)} EGP/gram`, "Price"];
                    }
                    return [String(value || ""), "Price"];
                  }}
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
            <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
              <Col xs={12} sm={6}>
                <Card
                  size="small"
                  style={{ background: "#e6f4ff", borderColor: "#91caff" }}
                >
                  <Statistic
                    title="Highest Price"
                    value={Math.max(...chartData.map((d) => d.price)).toFixed(
                      3
                    )}
                    suffix="EGP/gram"
                    valueStyle={{ fontSize: "16px", color: "#1677ff" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card
                  size="small"
                  style={{ background: "#fff1f0", borderColor: "#ffccc7" }}
                >
                  <Statistic
                    title="Lowest Price"
                    value={Math.min(...chartData.map((d) => d.price)).toFixed(
                      3
                    )}
                    suffix="EGP/gram"
                    valueStyle={{ fontSize: "16px", color: "#ff4d4f" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card
                  size="small"
                  style={{ background: "#fffbe6", borderColor: "#ffe58f" }}
                >
                  <Statistic
                    title="Price Range"
                    value={(
                      Math.max(...chartData.map((d) => d.price)) -
                      Math.min(...chartData.map((d) => d.price))
                    ).toFixed(3)}
                    suffix="EGP"
                    valueStyle={{ fontSize: "16px", color: "#faad14" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card
                  size="small"
                  style={{ background: "#f6ffed", borderColor: "#b7eb8f" }}
                >
                  <Statistic
                    title="Price Change"
                    value={
                      chartData.length > 1
                        ? (
                            ((chartData[chartData.length - 1].price -
                              chartData[0].price) /
                              chartData[0].price) *
                            100
                          ).toFixed(2)
                        : 0
                    }
                    suffix="%"
                    prefix={
                      chartData.length > 1 &&
                      chartData[chartData.length - 1].price >
                        chartData[0].price ? (
                        <RiseOutlined />
                      ) : (
                        <FallOutlined />
                      )
                    }
                    valueStyle={{
                      fontSize: "16px",
                      color:
                        chartData.length > 1 &&
                        chartData[chartData.length - 1].price >
                          chartData[0].price
                          ? "#52c41a"
                          : "#ff4d4f",
                    }}
                  />
                </Card>
              </Col>
            </Row>
          )}
        </Card>
      )}
    </Space>
  );
}
