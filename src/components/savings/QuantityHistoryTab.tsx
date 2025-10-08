"use client";

import { useState } from "react";
import { RateEntry } from "@/types";
import {
  formatDate,
  formatNumber,
  getComparisonClass,
  getComparisonIcon,
} from "@/lib/utils";
import { Card, Space, Typography, Button, Empty, Tag } from "antd";
import {
  DollarOutlined,
  GoldOutlined,
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface QuantityHistoryTabProps {
  quantityHistory: RateEntry[];
}

type SavingsType =
  | "usdAmount"
  | "egpAmount"
  | "gold18Amount"
  | "gold21Amount"
  | "gold24Amount";

interface SavingsTypeInfo {
  key: SavingsType;
  label: string;
  unit: string;
  icon: React.ReactNode;
}

const savingsTypes: SavingsTypeInfo[] = [
  { key: "usdAmount", label: "USD", unit: "$", icon: <DollarOutlined /> },
  { key: "egpAmount", label: "EGP", unit: "EGP", icon: "💰" },
  { key: "gold18Amount", label: "18K Gold", unit: "g", icon: <GoldOutlined style={{ color: "#cd7f32" }} /> },
  { key: "gold21Amount", label: "21K Gold", unit: "g", icon: <GoldOutlined style={{ color: "#faad14" }} /> },
  { key: "gold24Amount", label: "24K Gold", unit: "g", icon: <GoldOutlined style={{ color: "#ffd700" }} /> },
];

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

export default function QuantityHistoryTab({
  quantityHistory,
}: QuantityHistoryTabProps) {
  const [selectedType, setSelectedType] = useState<SavingsType>(
    savingsTypes[0].key
  );

  if (quantityHistory.length === 0) {
    return (
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={2}>Savings Quantity History</Title>
        <Empty
          description="No quantity history available. Save some savings amounts first."
          style={{ padding: "40px 0" }}
        />
      </Space>
    );
  }

  // Filter entries that have changes for the selected type
  const getFilteredEntries = (type: SavingsType) => {
    return quantityHistory.filter((entry, index) => {
      if (index === quantityHistory.length - 1) return entry[type] > 0;

      const previousEntry = quantityHistory[index + 1];
      return entry[type] !== previousEntry[type];
    });
  };

  // Get comparison data for a specific type
  const getTypeComparison = (
    currentEntry: RateEntry,
    previousEntry: RateEntry | null,
    type: SavingsType
  ) => {
    const currentValue = currentEntry[type];
    const previousValue = previousEntry ? previousEntry[type] : 0;

    return {
      currentValue,
      previousValue,
      comparisonClass: getComparisonClass(currentValue, previousValue),
      comparisonIcon: getComparisonIcon(currentValue, previousValue),
      change: currentValue - previousValue,
    };
  };

  const filteredEntries = getFilteredEntries(selectedType);
  const selectedTypeInfo = savingsTypes.find((t) => t.key === selectedType)!;

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={2}>Savings Quantity History</Title>
        <Text type="secondary">
          Track changes to your savings quantities over time
        </Text>
      </div>

      {/* Filter Tabs */}
      <Space wrap size="small">
        {savingsTypes.map((type) => (
          <Button
            key={type.key}
            type={selectedType === type.key ? "primary" : "default"}
            icon={type.icon}
            onClick={() => setSelectedType(type.key)}
          >
            {type.label}
          </Button>
        ))}
      </Space>

      {filteredEntries.length === 0 ? (
        <Empty
          description="No history found for the selected type."
          style={{ padding: "40px 0" }}
        />
      ) : (
        <Card
          title={
            <Space>
              {selectedTypeInfo.icon}
              <span>{selectedTypeInfo.label} Timeline</span>
            </Space>
          }
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {filteredEntries.map((entry, index) => {
              const previousEntry =
                index < filteredEntries.length - 1
                  ? filteredEntries[index + 1]
                  : null;
              const comparison = getTypeComparison(
                entry,
                previousEntry,
                selectedType as SavingsType
              );

              return (
                <Card
                  key={entry.id}
                  size="small"
                  style={{ background: "#fafafa" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Text strong style={{ display: "block" }}>
                        {formatDate(entry.timestamp)}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Entry #
                        {quantityHistory.length -
                          quantityHistory.findIndex((e) => e.id === entry.id)}
                      </Text>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Space align="center">
                        {getComparisonIconComponent(comparison.comparisonIcon)}
                        <Text strong style={{ fontSize: "16px" }}>
                          {formatNumber(comparison.currentValue)}{" "}
                          {selectedTypeInfo.unit}
                        </Text>
                      </Space>
                      {comparison.previousValue > 0 &&
                        comparison.change !== 0 && (
                          <div style={{ marginTop: "4px" }}>
                            <Tag
                              color={getTagColor(comparison.comparisonIcon)}
                              style={{ fontSize: "11px" }}
                            >
                              {comparison.change > 0 ? "+" : ""}
                              {formatNumber(comparison.change)}{" "}
                              {selectedTypeInfo.unit}
                            </Tag>
                          </div>
                        )}
                    </div>
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
