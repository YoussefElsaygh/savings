"use client";

// import { useState } from "react";
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
  if (icon === "→") return <MinusOutlined style={{ color: "#faad14" }} />;
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
  const deleteEntry = async (index: number) => {
    const newHistory = allHistory.filter(
      (_: RateEntry, i: number) => i !== index
    );
    try {
      await setAllHistory(newHistory);
    } catch (error) {
      console.error("Error deleting history entry:", error);
    }
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

                  return (
                    <Card
                      key={entry.id}
                      size="small"
                      extra={
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => deleteEntry(entry.originalIndex)}
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
                            <Text type="secondary" style={{ fontSize: "12px" }}>
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
                          <Text type="secondary" style={{ fontSize: "13px" }}>
                            USD: {formatNumber(entry.usdRate)}
                          </Text>
                          <Text type="secondary" style={{ fontSize: "13px" }}>
                            18K: {formatNumber(entry.gold18Rate)}
                          </Text>
                          <Text type="secondary" style={{ fontSize: "13px" }}>
                            21K: {formatNumber(entry.gold21Rate)}
                          </Text>
                          <Text type="secondary" style={{ fontSize: "13px" }}>
                            24K: {formatNumber(entry.gold21Rate / 0.875)}
                          </Text>
                        </div>

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
                            <Text strong style={{ fontSize: "18px" }}>
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
                            <Text type="secondary" style={{ fontSize: "13px" }}>
                              Change from previous:
                            </Text>
                            <Tag color={getTagColor(comparisonIcon)}>
                              {currentSum > previousSum ? "+" : ""}
                              {formatSum(currentSum - previousSum)} EGP
                            </Tag>
                          </div>
                        )}
                      </Space>
                    </Card>
                  );
                })}
              </Space>
            </Panel>
          );
        })}
      </Collapse>
    </Space>
  );
}
