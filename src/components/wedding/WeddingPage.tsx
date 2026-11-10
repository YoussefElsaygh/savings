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
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useWeddingSpendingFirebase } from "@/hooks/useFirebaseData";
import { WeddingExpense } from "@/types";
import {
  DEFAULT_WEDDING_CATEGORIES,
  UNCATEGORIZED_LABEL,
} from "@/constants/wedding-categories";
import AddWeddingExpenseModal, {
  WeddingExpenseFormData,
} from "./AddWeddingExpenseModal";
import ManageCategoriesModal from "./ManageCategoriesModal";
import LoadingScreen from "@/components/shared/LoadingScreen";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function WeddingPage() {
  const [weddingData, saveWeddingData, loading, error, user] =
    useWeddingSpendingFirebase();
  const [modalOpen, setModalOpen] = useState(false);
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<WeddingExpense | null>(
    null
  );

  const categories = weddingData.categories ?? DEFAULT_WEDDING_CATEGORIES;

  // Calculate total from expenses
  const totalSpent = weddingData.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Persist expenses and categories together (the document is saved whole)
  const persist = async (
    expenses: WeddingExpense[],
    nextCategories: string[] = categories
  ) => {
    const updatedTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    await saveWeddingData({
      expenses,
      totalSpent: updatedTotal,
      categories: nextCategories,
    });
  };

  const handleAddExpense = async (expenseData: WeddingExpenseFormData) => {
    const newExpense: WeddingExpense = {
      id: Date.now().toString(),
      amount: expenseData.amount,
      description: expenseData.description,
      category: expenseData.category,
      date: expenseData.date,
      timestamp: new Date().toISOString(),
    };

    await persist([...weddingData.expenses, newExpense]);
  };

  const handleEditExpense = async (
    expenseId: string,
    expenseData: WeddingExpenseFormData
  ) => {
    const updatedExpenses = weddingData.expenses.map((exp) =>
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

    await persist(updatedExpenses);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const updatedExpenses = weddingData.expenses.filter(
      (exp) => exp.id !== expenseId
    );
    await persist(updatedExpenses);
  };

  const handleSaveCategories = async (
    nextCategories: string[],
    renames: { from: string; to: string }[]
  ) => {
    const renameMap = new Map(renames.map((r) => [r.from, r.to]));
    const updatedExpenses = weddingData.expenses.map((exp) =>
      exp.category && renameMap.has(exp.category)
        ? { ...exp, category: renameMap.get(exp.category) }
        : exp
    );
    await persist(updatedExpenses, nextCategories);
  };

  const getCategoryUsage = (category: string) =>
    weddingData.expenses.filter((exp) => exp.category === category).length;

  const handleOpenEditModal = (expense: WeddingExpense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  // Totals per category: every configured category, plus any expense whose
  // category is missing or no longer configured (shown as Uncategorized)
  const categoryStats = (() => {
    const map = new Map<string, { total: number; count: number }>();
    const add = (name: string, amount: number) => {
      const entry = map.get(name) ?? { total: 0, count: 0 };
      entry.total += amount;
      entry.count += 1;
      map.set(name, entry);
    };

    weddingData.expenses.forEach((exp) => {
      const name =
        exp.category && categories.includes(exp.category)
          ? exp.category
          : UNCATEGORIZED_LABEL;
      add(name, exp.amount);
    });

    const rows = categories.map((name) => ({
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
  const sortedExpenses = [...weddingData.expenses].sort((a, b) => {
    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("MMM DD, YYYY"),
      sorter: (a: WeddingExpense, b: WeddingExpense) =>
        dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string | undefined) =>
        category || <Text type="secondary">{UNCATEGORIZED_LABEL}</Text>,
      sorter: (a: WeddingExpense, b: WeddingExpense) =>
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
      sorter: (a: WeddingExpense, b: WeddingExpense) => a.amount - b.amount,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: WeddingExpense) => (
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
        tip={!user ? "Checking authentication..." : "Loading wedding spending data..."}
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
            Wedding Spending
          </Title>
          <Text type="secondary">Track your total wedding expenses</Text>
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
              value={weddingData.expenses.length}
              suffix="items"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Average Expense"
              value={
                weddingData.expenses.length > 0
                  ? totalSpent / weddingData.expenses.length
                  : 0
              }
              precision={2}
              prefix="EGP"
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Spending by Category"
        extra={
          <Button
            type="link"
            icon={<SettingOutlined />}
            onClick={() => setCategoriesModalOpen(true)}
          >
            Manage Categories
          </Button>
        }
        style={{ marginBottom: "24px" }}
      >
        {weddingData.expenses.length === 0 ? (
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

      <AddWeddingExpenseModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        categories={categories}
        onAddExpense={handleAddExpense}
        onEditExpense={handleEditExpense}
        editingExpense={editingExpense}
      />

      <ManageCategoriesModal
        isOpen={categoriesModalOpen}
        onClose={() => setCategoriesModalOpen(false)}
        categories={categories}
        getUsageCount={getCategoryUsage}
        onSave={handleSaveCategories}
      />
    </div>
  );
}
