"use client";

import { useEffect, useState } from "react";
import { SavingsData, RateEntry } from "@/types";
import {
  formatNumber,
  formatSum,
  formatDate,
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
import ModalContainer from "@/components/shared/ModalContainer";

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
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<RateEntry | null>(null);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  // Get entries for display - either 5 or all based on toggle
  const rateHistory = showAllHistory ? allHistory : allHistory.slice(0, 5);
  const [usdRate, setUsdRate] = useState("");
  const [gold21Rate, setGold21Rate] = useState("");

  useEffect(() => {
    setGold21Rate(gold21Price?.toString() || "");
  }, [gold21Price]);

  useEffect(() => {
    setUsdRate(usdPrice?.toString() || "");
  }, [usdPrice]);

  const calculateTotal = async () => {
    const usdRateNum = Number(usdRate) || 0;
    const gold21RateNum = Number(gold21Rate) || 0;
    const gold18RateNum = gold21RateNum / 1.1667;
    const gold24RateNum = gold21RateNum / 0.875;

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

    if (usdRateNum > 0 || gold21RateNum > 0) {
      const newEntryId = Date.now().toString();
      const newEntry: RateEntry = {
        id: newEntryId,
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

      // Set the ID before updating to ensure animation class is applied from the start
      setNewlyAddedId(newEntryId);

      try {
        await setAllHistory(updatedAllHistory);
        // Remove animation class after animation completes
        setTimeout(() => setNewlyAddedId(null), 700);
      } catch (error) {
        console.error("Error saving calculation to history:", error);
        setNewlyAddedId(null);
      }
    }
  };

  const loadFromHistory = (entry: RateEntry) => {
    setUsdRate(entry.usdRate.toString());
    setGold21Rate(entry.gold21Rate.toString());
  };

  const showDetailedCalculation = (entry: RateEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntry(entry);
  };

  const getDetailedBreakdown = (entry: RateEntry) => {
    const gold18RateNum = entry.gold21Rate / 1.1667;
    const gold24RateNum = entry.gold21Rate / 0.875;

    return {
      usd: entry.usdAmount * entry.usdRate,
      egp: entry.egpAmount,
      gold18: entry.gold18Amount * gold18RateNum,
      gold21: entry.gold21Amount * entry.gold21Rate,
      gold24: entry.gold24Amount * gold24RateNum,
    };
  };

  const getTagColor = (icon: string) => {
    if (icon === "↑") return "success";
    if (icon === "↓") return "error";
    return "warning";
  };

  const getComparisonIcon = (icon: string) => {
    if (icon === "↑") return <RiseOutlined style={{ color: "#52c41a" }} />;
    if (icon === "↓") return <FallOutlined style={{ color: "#ff4d4f" }} />;
    if (icon === "→") return <MinusOutlined style={{ color: "#000000" }} />;
    return <StarOutlined />;
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideInDown {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
            max-height: 0;
          }
          1% {
            max-height: 500px;
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            max-height: 500px;
          }
        }

        .new-entry-animation {
          animation: slideInDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          animation-fill-mode: both !important;
          transform-origin: top center !important;
        }
      `,
        }}
      />
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

        {/* Rate History */}
        {allHistory.length > 0 && (
          <Card
            title={<Text strong>Recent Calculations</Text>}
            extra={
              allHistory.length > 5 && (
                <Button
                  type="link"
                  onClick={() => setShowAllHistory(!showAllHistory)}
                >
                  {showAllHistory
                    ? "Show Recent (5)"
                    : `Show All (${allHistory.length})`}
                </Button>
              )
            }
          >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              {rateHistory.map((entry: RateEntry, index: number) => {
                const currentSum = calculateHistorySum(entry);
                const previousEntry =
                  index < rateHistory.length - 1
                    ? rateHistory[index + 1]
                    : null;
                const previousSum = previousEntry
                  ? calculateHistorySum(previousEntry)
                  : 0;
                const comparisonIcon = getComparisonIconString(
                  currentSum,
                  previousSum
                );

                const isNewEntry = entry.id === newlyAddedId;

                return (
                  <div
                    key={entry.id}
                    className={isNewEntry ? "new-entry-animation" : ""}
                  >
                    <Card
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
                            <Text
                              strong
                              style={{
                                color:
                                  comparisonIcon === "↑"
                                    ? "#52c41a"
                                    : comparisonIcon === "↓"
                                    ? "#ff4d4f"
                                    : "#000000",
                              }}
                            >
                              {formatSum(currentSum)} EGP
                            </Text>
                          </Space>
                          {previousSum > 0 && (
                            <Tag color={getTagColor(comparisonIcon)}>
                              {currentSum > previousSum ? "+" : ""}
                              {formatSum(currentSum - previousSum)} EGP
                            </Tag>
                          )}
                          <Button
                            type="link"
                            size="small"
                            onClick={(e) => showDetailedCalculation(entry, e)}
                          >
                            View Details
                          </Button>
                        </Space>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </Space>
          </Card>
        )}

        {/* Detailed Calculation Modal */}
        <ModalContainer
          isOpen={selectedEntry !== null}
          onClose={() => setSelectedEntry(null)}
          title={
            selectedEntry ? (
              <Space direction="vertical" size="small">
                <Text strong style={{ fontSize: "18px" }}>
                  Calculation Details
                </Text>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  {formatDate(selectedEntry.timestamp)}
                </Text>
              </Space>
            ) : (
              "Calculation Details"
            )
          }
          maxWidth={600}
          heightMode="fit-content"
          footer={[
            <Button key="close" onClick={() => setSelectedEntry(null)}>
              Close
            </Button>,
            <Button
              key="load"
              type="primary"
              onClick={() => {
                if (selectedEntry) {
                  loadFromHistory(selectedEntry);
                  setSelectedEntry(null);
                }
              }}
            >
              Load These Rates
            </Button>,
          ]}
        >
          {selectedEntry && (
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Card size="small" title="Exchange Rates Used">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                    }}
                  >
                    <Text type="secondary">USD Rate:</Text>
                    <Text strong>
                      {formatNumber(selectedEntry.usdRate)} EGP
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                    }}
                  >
                    <Text type="secondary">18K Gold Rate:</Text>
                    <Text strong>
                      {formatNumber(selectedEntry.gold21Rate / 1.1667)} EGP/g
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                    }}
                  >
                    <Text type="secondary">21K Gold Rate:</Text>
                    <Text strong>
                      {formatNumber(selectedEntry.gold21Rate)} EGP/g
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                    }}
                  >
                    <Text type="secondary">24K Gold Rate:</Text>
                    <Text strong>
                      {formatNumber(selectedEntry.gold21Rate / 0.875)} EGP/g
                    </Text>
                  </div>
                </Space>
              </Card>

              <Card size="small" title="Breakdown by Asset">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {selectedEntry.usdAmount > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Text type="secondary">
                        USD ({formatNumber(selectedEntry.usdAmount)} $)
                      </Text>
                      <Text strong style={{ fontSize: "16px" }}>
                        {formatNumber(getDetailedBreakdown(selectedEntry).usd)}{" "}
                        EGP
                      </Text>
                    </div>
                  )}
                  {selectedEntry.egpAmount > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Text type="secondary">
                        EGP ({formatNumber(selectedEntry.egpAmount)} EGP)
                      </Text>
                      <Text strong style={{ fontSize: "16px" }}>
                        {formatNumber(getDetailedBreakdown(selectedEntry).egp)}{" "}
                        EGP
                      </Text>
                    </div>
                  )}
                  {selectedEntry.gold18Amount > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Text type="secondary">
                        18K Gold ({formatNumber(selectedEntry.gold18Amount)} g)
                      </Text>
                      <Text strong style={{ fontSize: "16px" }}>
                        {formatNumber(
                          getDetailedBreakdown(selectedEntry).gold18
                        )}{" "}
                        EGP
                      </Text>
                    </div>
                  )}
                  {selectedEntry.gold21Amount > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Text type="secondary">
                        21K Gold ({formatNumber(selectedEntry.gold21Amount)} g)
                      </Text>
                      <Text strong style={{ fontSize: "16px" }}>
                        {formatNumber(
                          getDetailedBreakdown(selectedEntry).gold21
                        )}{" "}
                        EGP
                      </Text>
                    </div>
                  )}
                  {selectedEntry.gold24Amount > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Text type="secondary">
                        24K Gold ({formatNumber(selectedEntry.gold24Amount)} g)
                      </Text>
                      <Text strong style={{ fontSize: "16px" }}>
                        {formatNumber(
                          getDetailedBreakdown(selectedEntry).gold24
                        )}{" "}
                        EGP
                      </Text>
                    </div>
                  )}

                  <Divider style={{ margin: "8px 0" }} />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "8px",
                    }}
                  >
                    <Text strong style={{ fontSize: "18px" }}>
                      Total Value
                    </Text>
                    <Text
                      strong
                      style={{
                        fontSize: "22px",
                        color: "#52c41a",
                      }}
                    >
                      {formatSum(calculateHistorySum(selectedEntry))} EGP
                    </Text>
                  </div>
                </Space>
              </Card>
            </Space>
          )}
        </ModalContainer>
      </Space>
    </>
  );
}
