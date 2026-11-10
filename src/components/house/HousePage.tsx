"use client";

import { useState } from "react";
import {
  Typography,
  Row,
  Col,
  Button,
  Space,
  Statistic,
  Card,
  Table,
  Popconfirm,
  Progress,
  Empty,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useHouseSpendingFirebase } from "@/hooks/useFirebaseData";
import { HouseExpense } from "@/types";
import {
  HOUSE_CATEGORIES,
  UNCATEGORIZED_LABEL,
} from "@/constants/house-categories";
import AddHouseExpenseModal, {
  HouseExpenseFormData,
} from "./AddHouseExpenseModal";
import LoadingScreen from "@/components/shared/LoadingScreen";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function HousePage() {
  const [houseData, saveHouseData, loading, error, user] =
    useHouseSpendingFirebase();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<HouseExpense | null>(
    null
  );

  // Calculate total from expenses
  const totalSpent = houseData.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleAddExpense = async (expenseData: HouseExpenseFormData) => {
    const newExpense: HouseExpense = {
      id: Date.now().toString(),
      amount: expenseData.amount,
      description: expenseData.description,
      category: expenseData.category,
      date: expenseData.date,
      timestamp: new Date().toISOString(),
    };

    const updatedExpenses = [...houseData.expenses, newExpense];
    const updatedTotal = updatedExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    await saveHouseData({
      expenses: updatedExpenses,
      totalSpent: updatedTotal,
    });
  };

  const handleEditExpense = async (
    expenseId: string,
    expenseData: HouseExpenseFormData
  ) => {
    const updatedExpenses = houseData.expenses.map((exp) =>
      exp.id === expenseId
        ? {
            ...exp,
            amount: expenseData.amount,
            description: expenseData.description,
            category: expenseData.category,
            date: expenseData.date,
          }
        : exp
    );

    const updatedTotal = updatedExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    await saveHouseData({
      expenses: updatedExpenses,
      totalSpent: updatedTotal,
    });
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const updatedExpenses = houseData.expenses.filter(
      (exp) => exp.id !== expenseId
    );
    const updatedTotal = updatedExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    await saveHouseData({
      expenses: updatedExpenses,
      totalSpent: updatedTotal,
    });
  };

  const handleOpenEditModal = (expense: HouseExpense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  // Totals per category: every fixed category, plus any expense whose
  // category is missing or unrecognised (shown as Uncategorized)
  const categoryStats = (() => {
    const map = new Map<string, { total: number; count: number }>();
    houseData.expenses.forEach((exp) => {
      const name =
        exp.category && (HOUSE_CATEGORIES as readonly string[]).includes(exp.category)
          ? exp.category
          : UNCATEGORIZED_LABEL;
      const entry = map.get(name) ?? { total: 0, count: 0 };
      entry.total += exp.amount;
      entry.count += 1;
      map.set(name, entry);
    });

    const rows: { name: string; total: number; count: number }[] =
      HOUSE_CATEGORIES.map((name) => ({
      name,
      total: map.get(name)?.total ?? 0,
      count: map.get(name)?.count ?? 0,
    }));
    const uncategorized = map.get(UNCATEGORIZED_LABEL);
    if (uncategorized) {
      rows.push({
        name: UNCATEGORIZED_LABEL,
        total: uncategorized.total,
        count: uncategorized.count,
      });
    }
    return rows.sort((a, b) => b.total - a.total);
  })();

  // Sort expenses by date (newest first)
  const sortedExpenses = [...houseData.expenses].sort((a, b) => {
    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("MMM DD, YYYY"),
      sorter: (a: HouseExpense, b: HouseExpense) =>
        dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string | undefined) =>
        category || <Text type="secondary">Uncategorized</Text>,
      sorter: (a: HouseExpense, b: HouseExpense) =>
        (a.category ?? "").localeCompare(b.category ?? ""),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || <Text type="secondary">No description</Text>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <Text strong style={{ color: "#cf1322" }}>
          EGP {amount.toFixed(2)}
        </Text>
      ),
      sorter: (a: HouseExpense, b: HouseExpense) => a.amount - b.amount,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: HouseExpense) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete expense"
            description="Are you sure you want to delete this expense?"
            onConfirm={() => handleDeleteExpense(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading || !user) {
    return (
      <LoadingScreen
        tip={!user ? "Checking authentication..." : "Loading house spending data..."}
      />
    );
  }

  if (error) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <Text type="danger">{error}</Text>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "100%" }}>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <Title level={1} style={{ margin: 0 }}>
            House Spending
          </Title>
          <Text type="secondary">Track your total house expenses</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
          size="large"
        >
          Add Expense
        </Button>
      </Space>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Spent"
              value={totalSpent}
              precision={2}
              prefix="EGP"
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Expenses"
              value={houseData.expenses.length}
              suffix="items"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Average Expense"
              value={
                houseData.expenses.length > 0
                  ? totalSpent / houseData.expenses.length
                  : 0
              }
              precision={2}
              prefix="EGP"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Spending by Category" style={{ marginBottom: "24px" }}>
        {houseData.expenses.length === 0 ? (
          <Empty description="No expenses yet" />
        ) : (
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            {categoryStats.map((row) => {
              const percent =
                totalSpent > 0 ? (row.total / totalSpent) * 100 : 0;
              return (
                <div key={row.name}>
                  <Row justify="space-between" wrap={false} gutter={8}>
                    <Col flex="auto" style={{ minWidth: 0 }}>
                      <Text strong ellipsis>
                        {row.name}
                      </Text>
                      <Text type="secondary" style={{ marginLeft: 8 }}>
                        {row.count} {row.count === 1 ? "item" : "items"}
                      </Text>
                    </Col>
                    <Col>
                      <Text strong style={{ color: "#cf1322" }}>
                        EGP {row.total.toFixed(2)}
                      </Text>
                    </Col>
                  </Row>
                  <Progress
                    percent={Number(percent.toFixed(1))}
                    showInfo={false}
                    strokeColor="#cf1322"
                    size="small"
                  />
                </div>
              );
            })}
          </Space>
        )}
      </Card>

      <Card title="Expense History" style={{ marginTop: "16px" }}>
        <Table
          dataSource={sortedExpenses}
          columns={columns}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} expenses`,
          }}
        />
      </Card>

      <AddHouseExpenseModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onAddExpense={handleAddExpense}
        onEditExpense={handleEditExpense}
        editingExpense={editingExpense}
      />
    </div>
  );
}

