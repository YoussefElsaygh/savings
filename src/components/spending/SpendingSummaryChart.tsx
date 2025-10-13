"use client";

import { Card, Typography, Empty, Spin } from "antd";
import dynamic from "next/dynamic";
import { SpendingCategory } from "@/types";

const Pie = dynamic(() => import("@ant-design/plots").then((mod) => mod.Pie), {
  ssr: false,
  loading: () => (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <Spin />
    </div>
  ),
});

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
      text: "type",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "bottom",
        rowPadding: 5,
      },
    },
    style: {
      lineWidth: 1,
      stroke: "#fff",
    },
    tooltip: {
      title: "type",
      items: [
        {
          field: "value",
          valueFormatter: (value: number) => `EGP ${value.toFixed(2)}`,
        },
      ],
    },
    annotations: [
      {
        type: "text",
        style: {
          text: `EGP ${totalSpent.toFixed(2)}`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 24,
          fontWeight: "bold",
        },
      },
      {
        type: "text",
        style: {
          text: "Total",
          x: "50%",
          y: "45%",
          textAlign: "center",
          fontSize: 14,
          fill: "#999",
        },
      },
    ],
    scale: {
      color: {
        range: data.map((item) => item.color),
      },
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
        Total: EGP {totalSpent.toFixed(2)}
      </Text>
      <div style={{ height: 400 }}>
        <Pie {...config} />
      </div>
    </Card>
  );
}
