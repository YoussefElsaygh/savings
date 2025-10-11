"use client";

import { useState } from "react";
import {
  Typography,
  Row,
  Col,
  Button,
  Space,
  Select,
  Statistic,
  Card,
  Spin,
} from "antd";
import { PlusOutlined, DollarOutlined } from "@ant-design/icons";
import { useSpendingDataFirebase } from "@/hooks/useFirebaseData";
import { Expense, MonthlySpending } from "@/types";
import { DEFAULT_SPENDING_CATEGORIES } from "@/constants/categories";
import AddExpenseModal from "./AddExpenseModal";
import SpendingSummaryChart from "./SpendingSummaryChart";
import CategoryBreakdown from "./CategoryBreakdown";
import MonthlySpendingSection from "./MonthlySpendingSection";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function SpendingPage() {
  const [spendingData, saveSpendingData, loading, error, user] =
    useSpendingDataFirebase();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() =>
    dayjs().format("YYYY-MM")
  );

  const getCurrentMonthData = (): MonthlySpending => {
    const existing = spendingData.monthlyData.find(
      (m) => m.month === selectedMonth
    );
    if (existing) return existing;

    return {
      month: selectedMonth,
      expenses: [],
      totalSpent: 0,
      categoryTotals: {},
    };
  };

  const monthData = getCurrentMonthData();

  const handleAddExpense = async (expenseData: {
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: expenseData.amount,
      category: expenseData.category,
      description: expenseData.description,
      date: expenseData.date,
      timestamp: new Date().toISOString(),
    };

    const expenseMonth = dayjs(expenseData.date).format("YYYY-MM");
    const monthIndex = spendingData.monthlyData.findIndex(
      (m) => m.month === expenseMonth
    );

    let updatedMonthlyData = [...spendingData.monthlyData];

    if (monthIndex >= 0) {
      // Update existing month
      const updatedMonth = { ...updatedMonthlyData[monthIndex] };
      updatedMonth.expenses = [...updatedMonth.expenses, newExpense];
      updatedMonth.totalSpent += newExpense.amount;
      updatedMonth.categoryTotals = {
        ...updatedMonth.categoryTotals,
        [newExpense.category]:
          (updatedMonth.categoryTotals[newExpense.category] || 0) +
          newExpense.amount,
      };
      updatedMonthlyData[monthIndex] = updatedMonth;
    } else {
      // Create new month
      const newMonth: MonthlySpending = {
        month: expenseMonth,
        expenses: [newExpense],
        totalSpent: newExpense.amount,
        categoryTotals: {
          [newExpense.category]: newExpense.amount,
        },
      };
      updatedMonthlyData = [newMonth, ...updatedMonthlyData];
    }

    await saveSpendingData({
      ...spendingData,
      monthlyData: updatedMonthlyData,
    });
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const monthIndex = spendingData.monthlyData.findIndex(
      (m) => m.month === selectedMonth
    );

    if (monthIndex < 0) return;

    const updatedMonthlyData = [...spendingData.monthlyData];
    const updatedMonth = { ...updatedMonthlyData[monthIndex] };
    const expenseToDelete = updatedMonth.expenses.find(
      (e) => e.id === expenseId
    );

    if (!expenseToDelete) return;

    updatedMonth.expenses = updatedMonth.expenses.filter(
      (e) => e.id !== expenseId
    );
    updatedMonth.totalSpent -= expenseToDelete.amount;
    updatedMonth.categoryTotals = {
      ...updatedMonth.categoryTotals,
      [expenseToDelete.category]:
        (updatedMonth.categoryTotals[expenseToDelete.category] || 0) -
        expenseToDelete.amount,
    };

    updatedMonthlyData[monthIndex] = updatedMonth;

    await saveSpendingData({
      ...spendingData,
      monthlyData: updatedMonthlyData,
    });
  };

  // Generate month options for last 12 months
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = dayjs().subtract(i, "month");
    return {
      value: month.format("YYYY-MM"),
      label: month.format("MMMM YYYY"),
    };
  });

  if (loading || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin
          size="large"
          tip={
            !user ? "Checking authentication..." : "Loading spending data..."
          }
        />
      </div>
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
        }}
      >
        <div>
          <Title level={1} style={{ margin: 0 }}>
            Monthly Spending
          </Title>
          <Text type="secondary">Track and analyze your expenses</Text>
        </div>
        <Space>
          <Select
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={monthOptions}
            style={{ width: 200 }}
            size="large"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            size="large"
          >
            Add Expense
          </Button>
        </Space>
      </Space>

      <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Spent"
              value={monthData.totalSpent}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Transactions"
              value={monthData.expenses.length}
              suffix="expenses"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Avg Per Day"
              value={monthData.totalSpent / dayjs(selectedMonth).daysInMonth()}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <SpendingSummaryChart
            categoryTotals={monthData.categoryTotals}
            categories={DEFAULT_SPENDING_CATEGORIES}
            month={dayjs(selectedMonth).format("MMMM YYYY")}
          />
        </Col>
        <Col xs={24} lg={12}>
          <CategoryBreakdown
            categoryTotals={monthData.categoryTotals}
            categories={DEFAULT_SPENDING_CATEGORIES}
            totalSpent={monthData.totalSpent}
          />
        </Col>
      </Row>

      <div style={{ marginTop: "16px" }}>
        <MonthlySpendingSection
          expenses={monthData.expenses}
          categories={DEFAULT_SPENDING_CATEGORIES}
          onDeleteExpense={handleDeleteExpense}
        />
      </div>

      <AddExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddExpense={handleAddExpense}
        categories={DEFAULT_SPENDING_CATEGORIES}
      />
    </div>
  );
}
