"use client";

import { useState } from "react";
import { RateEntry } from "@/types";
import {
  formatDate,
  formatSum,
  formatNumber,
  getComparisonIcon,
} from "@/lib/utils";
import { Card, Space, Typography, Button, Empty, Collapse, Tag } from "antd";
import {
  DeleteOutlined,
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  DownOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface HistoryTabProps {
  allHistory: RateEntry[];
  setAllHistory: (history: RateEntry[]) => Promise<void>;
}

interface MonthGroup {
  monthName: string;
  entries: (RateEntry & { originalIndex: number })[];
}

interface MonthGroups {
  [key: string]: MonthGroup;
}

const getComparisonIconComponent = (icon: string) => {
  if (icon === "↑") return <RiseOutlined style={{ color: "#52c41a" }} />;
  if (icon === "↓") return <FallOutlined style={{ color: "#ff4d4f" }} />;
  if (icon === "→") return <MinusOutlined style={{ color: "#000000" }} />;
  return null;
};

const getTagColor = (icon: string) => {
  if (icon === "↑") return "success";
  if (icon === "↓") return "error";
  return "warning";
};

export default function HistoryTab({
  allHistory,
  setAllHistory,
}: HistoryTabProps) {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(
    new Set()
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteEntry = async (index: number, entryId: string) => {
    // Trigger fade-out animation
    setDeletingId(entryId);

    // Wait for animation to complete
    setTimeout(async () => {
      const newHistory = allHistory.filter(
        (_: RateEntry, i: number) => i !== index
      );
      try {
        await setAllHistory(newHistory);
        setDeletingId(null);
      } catch (error) {
        console.error("Error deleting history entry:", error);
        setDeletingId(null);
      }
    }, 400);
  };

  const toggleDetailedView = (entryId: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
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

  if (allHistory.length === 0) {
    return (
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={2}>Full Calculation History</Title>
        <Empty
          description="No calculation history available. Calculate your savings first."
          style={{ padding: "40px 0" }}
        />
      </Space>
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
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeOutLeft {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-30px);
          }
        }

        .delete-animation {
          animation: fadeOutLeft 0.4s ease-out !important;
          animation-fill-mode: both !important;
        }
      `,
        }}
      />
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={2}>Full Calculation History</Title>

        <Collapse
          defaultActiveKey={sortedMonths}
          expandIcon={({ isActive }) => (
            <DownOutlined rotate={isActive ? 0 : -90} />
          )}
        >
          {sortedMonths.map((monthKey) => {
            const monthData = historyByMonth[monthKey];

            return (
              <Panel
                header={`${monthData.monthName} (${monthData.entries.length} entries)`}
                key={monthKey}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {monthData.entries.map((entry, index) => {
                    const currentSum = entry.sum;
                    const previousEntry =
                      index < monthData.entries.length - 1
                        ? monthData.entries[index + 1]
                        : null;
                    const previousSum = previousEntry ? previousEntry.sum : 0;
                    const comparisonIcon = getComparisonIcon(
                      currentSum,
                      previousSum
                    );

                    const isExpanded = expandedEntries.has(entry.id);
                    const breakdown = getDetailedBreakdown(entry);
                    const isDeleting = deletingId === entry.id;

                    return (
                      <div
                        key={entry.id}
                        className={isDeleting ? "delete-animation" : ""}
                      >
                        <Card
                          size="small"
                          extra={
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() =>
                                deleteEntry(entry.originalIndex, entry.id)
                              }
                              disabled={isDeleting}
                            >
                              Delete
                            </Button>
                          }
                        >
                          <Space
                            direction="vertical"
                            size="small"
                            style={{ width: "100%" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                              }}
                            >
                              <div>
                                <Text strong style={{ fontSize: "16px" }}>
                                  {formatDate(entry.timestamp)}
                                </Text>
                                <br />
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  USD:{" "}
                                  <strong>
                                    {formatNumber(entry.usdAmount)} USD
                                  </strong>
                                  , EGP:{" "}
                                  <strong>
                                    {formatNumber(entry.egpAmount)} EGP
                                  </strong>
                                  , 18K:{" "}
                                  <strong>
                                    {formatNumber(entry.gold18Amount)}gm
                                  </strong>
                                  , 21K:{" "}
                                  <strong>
                                    {formatNumber(entry.gold21Amount)}gm
                                  </strong>
                                  , 24K:{" "}
                                  <strong>
                                    {formatNumber(entry.gold24Amount)}gm
                                  </strong>
                                </Text>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "12px",
                              }}
                            >
                              <Text
                                type="secondary"
                                style={{ fontSize: "13px" }}
                              >
                                USD: {formatNumber(entry.usdRate)}
                              </Text>
                              <Text
                                type="secondary"
                                style={{ fontSize: "13px" }}
                              >
                                18K: {formatNumber(entry.gold18Rate)}
                              </Text>
                              <Text
                                type="secondary"
                                style={{ fontSize: "13px" }}
                              >
                                21K: {formatNumber(entry.gold21Rate)}
                              </Text>
                              <Text
                                type="secondary"
                                style={{ fontSize: "13px" }}
                              >
                                24K: {formatNumber(entry.gold21Rate / 0.875)}
                              </Text>
                            </div>

                            {/* Detailed Breakdown - Shown when expanded */}
                            {isExpanded && (
                              <Card
                                size="small"
                                style={{
                                  background: "#fafafa",
                                  marginTop: "8px",
                                }}
                                title={
                                  <Text strong style={{ fontSize: "14px" }}>
                                    Detailed Breakdown
                                  </Text>
                                }
                              >
                                <Space
                                  direction="vertical"
                                  size="small"
                                  style={{ width: "100%" }}
                                >
                                  {entry.usdAmount > 0 && (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "4px 0",
                                      }}
                                    >
                                      <Text
                                        type="secondary"
                                        style={{ fontSize: "13px" }}
                                      >
                                        USD ({formatNumber(entry.usdAmount)} $ ×{" "}
                                        {formatNumber(entry.usdRate)})
                                      </Text>
                                      <Text strong style={{ fontSize: "14px" }}>
                                        {formatNumber(breakdown.usd)} EGP
                                      </Text>
                                    </div>
                                  )}
                                  {entry.egpAmount > 0 && (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "4px 0",
                                      }}
                                    >
                                      <Text
                                        type="secondary"
                                        style={{ fontSize: "13px" }}
                                      >
                                        EGP ({formatNumber(entry.egpAmount)})
                                      </Text>
                                      <Text strong style={{ fontSize: "14px" }}>
                                        {formatNumber(breakdown.egp)} EGP
                                      </Text>
                                    </div>
                                  )}
                                  {entry.gold18Amount > 0 && (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "4px 0",
                                      }}
                                    >
                                      <Text
                                        type="secondary"
                                        style={{ fontSize: "13px" }}
                                      >
                                        18K Gold (
                                        {formatNumber(entry.gold18Amount)}g ×{" "}
                                        {formatNumber(
                                          entry.gold21Rate / 1.1667
                                        )}
                                        )
                                      </Text>
                                      <Text strong style={{ fontSize: "14px" }}>
                                        {formatNumber(breakdown.gold18)} EGP
                                      </Text>
                                    </div>
                                  )}
                                  {entry.gold21Amount > 0 && (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "4px 0",
                                      }}
                                    >
                                      <Text
                                        type="secondary"
                                        style={{ fontSize: "13px" }}
                                      >
                                        21K Gold (
                                        {formatNumber(entry.gold21Amount)}g ×{" "}
                                        {formatNumber(entry.gold21Rate)})
                                      </Text>
                                      <Text strong style={{ fontSize: "14px" }}>
                                        {formatNumber(breakdown.gold21)} EGP
                                      </Text>
                                    </div>
                                  )}
                                  {entry.gold24Amount > 0 && (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "4px 0",
                                      }}
                                    >
                                      <Text
                                        type="secondary"
                                        style={{ fontSize: "13px" }}
                                      >
                                        24K Gold (
                                        {formatNumber(entry.gold24Amount)}g ×{" "}
                                        {formatNumber(entry.gold21Rate / 0.875)}
                                        )
                                      </Text>
                                      <Text strong style={{ fontSize: "14px" }}>
                                        {formatNumber(breakdown.gold24)} EGP
                                      </Text>
                                    </div>
                                  )}
                                </Space>
                              </Card>
                            )}

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingTop: "8px",
                                borderTop: "1px solid #f0f0f0",
                              }}
                            >
                              <Text strong>Total:</Text>
                              <Space>
                                {getComparisonIconComponent(comparisonIcon)}
                                <Text
                                  strong
                                  style={{
                                    fontSize: "18px",
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
                            </div>

                            {previousSum > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "13px" }}
                                >
                                  Change from previous:
                                </Text>
                                <Tag color={getTagColor(comparisonIcon)}>
                                  {currentSum > previousSum ? "+" : ""}
                                  {formatSum(currentSum - previousSum)} EGP
                                </Tag>
                              </div>
                            )}

                            <div style={{ paddingTop: "8px" }}>
                              <Button
                                type="link"
                                size="small"
                                onClick={() => toggleDetailedView(entry.id)}
                                style={{ padding: 0 }}
                              >
                                {isExpanded ? "Hide Details" : "Show Details"}
                              </Button>
                            </div>
                          </Space>
                        </Card>
                      </div>
                    );
                  })}
                </Space>
              </Panel>
            );
          })}
        </Collapse>
      </Space>
    </>
  );
}
