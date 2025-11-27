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
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useHouseSpendingFirebase } from "@/hooks/useFirebaseData";
import { HouseExpense } from "@/types";
import AddHouseExpenseModal from "./AddHouseExpenseModal";
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

  const handleAddExpense = async (expenseData: {
    amount: number;
    description: string;
    date: string;
  }) => {
    const newExpense: HouseExpense = {
      id: Date.now().toString(),
      amount: expenseData.amount,
      description: expenseData.description,
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
    expenseData: {
      amount: number;
      description: string;
      date: string;
    }
  ) => {
    const updatedExpenses = houseData.expenses.map((exp) =>
      exp.id === expenseId
        ? {
            ...exp,
            amount: expenseData.amount,
            description: expenseData.description,
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
      render: (_: any, record: HouseExpense) => (
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
    <div style={{ maxWidth: "100%", overflow: "hidden" }}>
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

      <Card title="Expense History" style={{ marginTop: "16px" }}>
        <Table
          dataSource={sortedExpenses}
          columns={columns}
          rowKey="id"
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

