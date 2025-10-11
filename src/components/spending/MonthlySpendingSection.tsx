"use client";

import { Card, Typography, List, Space, Tag, Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Expense, SpendingCategory } from "@/types";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface MonthlySpendingSectionProps {
  expenses: Expense[];
  categories: SpendingCategory[];
  onDeleteExpense: (expenseId: string) => void;
}

export default function MonthlySpendingSection({
  expenses,
  categories,
  onDeleteExpense,
}: MonthlySpendingSectionProps) {
  const sortedExpenses = [...expenses].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <Card>
      <Title level={4}>Recent Expenses</Title>
      <List
        dataSource={sortedExpenses}
        renderItem={(expense) => {
          const category = categories.find((c) => c.id === expense.category);
          return (
            <List.Item
              actions={[
                <Popconfirm
                  key="delete"
                  title="Delete this expense?"
                  description="This action cannot be undone."
                  onConfirm={() => onDeleteExpense(expense.id)}
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div
                    style={{
                      fontSize: "24px",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: category?.color || "#f0f0f0",
                      borderRadius: "8px",
                    }}
                  >
                    {category?.icon || "📦"}
                  </div>
                }
                title={
                  <Space>
                    <Text strong>${expense.amount.toFixed(2)}</Text>
                    <Tag color={category?.color}>
                      {category?.name || "Other"}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    {expense.description && (
                      <Text type="secondary" style={{ display: "block" }}>
                        {expense.description}
                      </Text>
                    )}
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {dayjs(expense.date).format("MMM D, YYYY")} •{" "}
                      {dayjs(expense.timestamp).format("h:mm A")}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      {sortedExpenses.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <Text type="secondary">No expenses recorded yet</Text>
        </div>
      )}
    </Card>
  );
}
