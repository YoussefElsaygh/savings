"use client";

import { Card, Typography, List, Progress, Space, Tag } from "antd";
import { SpendingCategory } from "@/types";

const { Title, Text } = Typography;

interface CategoryBreakdownProps {
  categoryTotals: Record<string, number>;
  categories: SpendingCategory[];
  totalSpent: number;
}

export default function CategoryBreakdown({
  categoryTotals,
  categories,
  totalSpent,
}: CategoryBreakdownProps) {
  const categoryData = categories
    .map((category) => {
      const amount = categoryTotals[category.id] || 0;
      const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
      return {
        ...category,
        amount,
        percentage,
      };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <Card>
      <Title level={4}>Category Breakdown</Title>
      <List
        dataSource={categoryData}
        renderItem={(item) => (
          <List.Item>
            <div style={{ width: "100%" }}>
              <Space
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <Space>
                  <span style={{ fontSize: "20px" }}>{item.icon}</span>
                  <Text strong>{item.name}</Text>
                </Space>
                <Space>
                  <Tag color={item.color}>${item.amount.toFixed(2)}</Tag>
                  <Text type="secondary">{item.percentage.toFixed(1)}%</Text>
                </Space>
              </Space>
              <Progress
                percent={item.percentage}
                strokeColor={item.color}
                showInfo={false}
                size="small"
              />
            </div>
          </List.Item>
        )}
      />
      {categoryData.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <Text type="secondary">No expenses recorded yet</Text>
        </div>
      )}
    </Card>
  );
}
