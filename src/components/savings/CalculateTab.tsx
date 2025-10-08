"use client";

import { useEffect, useState } from "react";
import { SavingsData, RateEntry } from "@/types";
import {
  formatNumber,
  formatSum,
  formatDate,
  getComparisonClass,
  getComparisonIcon as getComparisonIconString,
  calculateHistorySum,
} from "@/lib/utils";
import { Button, Card, Input, Tag, Space, Typography, Divider } from "antd";
import {
  DollarOutlined,
  GoldOutlined,
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  StarOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface CalculateTabProps {
  savings: SavingsData;
  allHistory: RateEntry[];
  gold21Price?: number | undefined;
  setAllHistory: (history: RateEntry[]) => Promise<void>;
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

  const calculateTotal = async () => {
    const usdRateNum = Number(usdRate) || 0;
    const gold21RateNum = Number(gold21Rate) || 0;
    const gold18RateNum = gold21RateNum / 1.1667;
    const gold24RateNum = gold21RateNum / 0.875;

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

    const previousTotal = allHistory.length > 0 ? allHistory[0].sum : 0;
    const comparisonClass = getComparisonClass(total, previousTotal);
    const comparisonIcon = getComparisonIconString(total, previousTotal);

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

      const updatedAllHistory = [newEntry, ...allHistory];
      try {
        await setAllHistory(updatedAllHistory);
      } catch (error) {
        console.error("Error saving calculation to history:", error);
      }
    }
  };

  const loadFromHistory = (entry: RateEntry) => {
    setUsdRate(entry.usdRate.toString());
    setGold21Rate(entry.gold21Rate.toString());
  };

  const getTagColor = (icon: string) => {
    if (icon === "↑") return "success";
    if (icon === "↓") return "error";
    return "warning";
  };

  const getComparisonIcon = (icon: string) => {
    if (icon === "↑") return <RiseOutlined />;
    if (icon === "↓") return <FallOutlined />;
    if (icon === "→") return <MinusOutlined />;
    return <StarOutlined />;
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={2}>Calculate Total Savings</Title>
        <Text type="secondary">
          Enter current exchange rates to calculate your total savings value
        </Text>
      </div>

      {/* Rate Input Forms */}
      <div
        style={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        <Card
          title={
            <Space>
              <DollarOutlined style={{ fontSize: "20px" }} />
              <span>USD Exchange Rate</span>
            </Space>
          }
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text>1 USD = ? EGP</Text>
            <Input
              type="number"
              step={0.01}
              placeholder="Enter USD exchange rate"
              value={usdRate}
              onChange={(e) => setUsdRate(e.target.value)}
              size="large"
              prefix={<DollarOutlined />}
            />
          </Space>
        </Card>

        <Card
          title={
            <Space>
              <GoldOutlined style={{ fontSize: "20px", color: "#faad14" }} />
              <span>Gold Price (21K)</span>
            </Space>
          }
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text>Price per gram (EGP)</Text>
            <Input
              type="number"
              step={0.01}
              placeholder="Enter 21K gold price"
              value={gold21Rate}
              onChange={(e) => setGold21Rate(e.target.value)}
              size="large"
              prefix={<GoldOutlined />}
            />
          </Space>
        </Card>
      </div>

      <Button
        size="large"
        icon={<CalculatorOutlined />}
        onClick={() => calculateTotal()}
        style={{
          minWidth: "200px",
          borderColor: "#000000",
          color: "#000000",
          borderWidth: "2px",
        }}
      >
        Calculate Total Savings
      </Button>

      {/* Results */}
      {result && (
        <Card
          style={{ background: "#f6ffed", borderColor: "#b7eb8f" }}
          title={<Text strong>Calculation Results</Text>}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {savings.usdAmount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Text type="secondary">
                  USD ({formatNumber(savings.usdAmount)} $)
                </Text>
                <Text strong style={{ fontSize: "16px" }}>
                  {formatNumber(result.breakdown.usd)} EGP
                </Text>
              </div>
            )}
            {savings.egpAmount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Text type="secondary">
                  EGP ({formatNumber(savings.egpAmount)} EGP)
                </Text>
                <Text strong style={{ fontSize: "16px" }}>
                  {formatNumber(result.breakdown.egp)} EGP
                </Text>
              </div>
            )}
            {savings.gold18Amount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Text type="secondary">
                  18K Gold ({formatNumber(savings.gold18Amount)} g)
                </Text>
                <Text strong style={{ fontSize: "16px" }}>
                  {formatNumber(result.breakdown.gold18)} EGP
                </Text>
              </div>
            )}
            {savings.gold21Amount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Text type="secondary">
                  21K Gold ({formatNumber(savings.gold21Amount)} g)
                </Text>
                <Text strong style={{ fontSize: "16px" }}>
                  {formatNumber(result.breakdown.gold21)} EGP
                </Text>
              </div>
            )}
            {savings.gold24Amount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Text type="secondary">
                  24K Gold ({formatNumber(savings.gold24Amount)} g)
                </Text>
                <Text strong style={{ fontSize: "16px" }}>
                  {formatNumber(result.breakdown.gold24)} EGP
                </Text>
              </div>
            )}

            <Divider style={{ margin: "8px 0" }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text strong style={{ fontSize: "18px" }}>
                Total Value
              </Text>
              <Space>
                {result.comparison &&
                  getComparisonIcon(result.comparison.comparisonIcon)}
                <Text
                  strong
                  style={{
                    fontSize: "22px",
                    color: result.comparison?.comparisonClass.includes("green")
                      ? "#52c41a"
                      : result.comparison?.comparisonClass.includes("red")
                      ? "#ff4d4f"
                      : "#faad14",
                  }}
                >
                  {formatSum(result.total)} EGP
                </Text>
              </Space>
            </div>

            {result.comparison?.previousTotal &&
              result.comparison.previousTotal > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text type="secondary">Change from previous</Text>
                  <Tag
                    color={getTagColor(result.comparison.comparisonIcon)}
                    style={{ fontSize: "14px", padding: "4px 8px" }}
                  >
                    {result.total > result.comparison.previousTotal ? "+" : ""}
                    {formatSum(
                      result.total - result.comparison.previousTotal
                    )}{" "}
                    EGP
                  </Tag>
                </div>
              )}
          </Space>
        </Card>
      )}

      {/* Rate History */}
      {rateHistory.length > 0 && (
        <Card title={<Text strong>Recent Calculations</Text>}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            {rateHistory.map((entry: RateEntry, index: number) => {
              const currentSum = calculateHistorySum(entry);
              const previousEntry =
                index < rateHistory.length - 1 ? rateHistory[index + 1] : null;
              const previousSum = previousEntry
                ? calculateHistorySum(previousEntry)
                : 0;
              const comparisonIcon = getComparisonIconString(
                currentSum,
                previousSum
              );

              return (
                <Card
                  key={entry.id}
                  size="small"
                  hoverable
                  onClick={() => loadFromHistory(entry)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Text strong>{formatDate(entry.timestamp)}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        USD: {formatNumber(entry.usdRate)} • EGP:{" "}
                        {formatNumber(entry.egpAmount)} • Gold 21K:{" "}
                        {formatNumber(entry.gold21Rate)}
                      </Text>
                    </div>
                    <Space direction="vertical" align="end">
                      <Space>
                        {getComparisonIcon(comparisonIcon)}
                        <Text strong>{formatSum(currentSum)} EGP</Text>
                      </Space>
                      {previousSum > 0 && (
                        <Tag color={getTagColor(comparisonIcon)}>
                          {currentSum > previousSum ? "+" : ""}
                          {formatSum(currentSum - previousSum)} EGP
                        </Tag>
                      )}
                    </Space>
                  </div>
                </Card>
              );
            })}
          </Space>
        </Card>
      )}
    </Space>
  );
}
