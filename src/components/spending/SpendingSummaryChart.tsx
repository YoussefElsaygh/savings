"use client";

import { Card, Typography, Empty } from "antd";
import { Pie } from "@ant-design/plots";
import { SpendingCategory } from "@/types";

const { Title, Text } = Typography;

interface SpendingSummaryChartProps {
  categoryTotals: Record<string, number>;
  categories: SpendingCategory[];
  month: string;
}

export default function SpendingSummaryChart({
  categoryTotals,
  categories,
  month,
}: SpendingSummaryChartProps) {
  const data = Object.entries(categoryTotals)
    .map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        type: category?.name || categoryId,
        value: amount,
        color: category?.color || "#ccc",
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalSpent = data.reduce((sum, item) => sum + item.value, 0);

  const config = {
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: "spider",
      labelHeight: 28,
      content: "{name}\n${value}",
    },
    color: ({ type }: { type: string }) => {
      const item = data.find((d) => d.type === type);
      return item?.color || "#ccc";
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "24px",
          fontWeight: "bold",
        },
        content: `$${totalSpent.toFixed(2)}`,
      },
    },
    legend: {
      layout: "horizontal",
      position: "bottom",
    },
  };

  if (data.length === 0) {
    return (
      <Card>
        <Title level={4}>{month} Spending Summary</Title>
        <Empty description="No expenses recorded yet" />
      </Card>
    );
  }

  return (
    <Card>
      <Title level={4}>{month} Spending Summary</Title>
      <Text type="secondary" style={{ display: "block", marginBottom: "16px" }}>
        Total: ${totalSpent.toFixed(2)}
      </Text>
      <Pie {...config} />
    </Card>
  );
}
