"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { TabType, isTabType } from "@/types";
import {
  useSavingsDataFirebase,
  useRateHistoryFirebase,
} from "@/hooks/useFirebaseData";
import EditTab from "@/components/savings/EditTab";
import CalculateTab from "@/components/savings/CalculateTab";
import QuantityHistoryTab from "@/components/savings/QuantityHistoryTab";
import HistoryTab from "@/components/savings/HistoryTab";
import Gold21ChartTab from "@/components/savings/Gold21ChartTab";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, Card, Spin, Typography, Button } from "antd";
import type { TabsProps } from "antd";
import {
  EditOutlined,
  CalculatorOutlined,
  HistoryOutlined,
  BarChartOutlined,
  GoldOutlined,
  LockOutlined,
  LoginOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function SavingsPage() {
  return (
    <Suspense>
      <SavingsContent />
    </Suspense>
  );
}

function SavingsContent() {
  const [activeTab, setActiveTabProp] = useState<TabType | null>(null);

  const [savings, setSavings, savingsLoading, savingsError, user, signIn] =
    useSavingsDataFirebase();
  const [allHistory, setAllHistory, historyLoading] = useRateHistoryFirebase();

  const router = useRouter();

  const setActiveTab = useCallback(
    (tab: TabType) => {
      setActiveTabProp(tab);
      router.push(`/savings?tab=${tab}`);
    },
    [router]
  );
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!savingsLoading && user) {
      const hasSavings =
        savings.usdAmount > 0 ||
        savings.egpAmount > 0 ||
        savings.gold18Amount > 0 ||
        savings.gold21Amount > 0 ||
        savings.gold24Amount > 0;

      const urlTab = searchParams.get("tab");
      if (isTabType(urlTab) && (hasSavings || urlTab === "gold21-chart")) {
        setActiveTab(urlTab as TabType);
        return;
      }
      if (!hasSavings) {
        setActiveTab("edit");
      } else {
        setActiveTab("calculate");
      }
    }
  }, [savingsLoading, user, searchParams, savings, setActiveTab]);

  const handleAfterSave = () => {
    if (activeTab === "edit") {
      setActiveTab("calculate");
    }
  };

  const hasSavedAmounts =
    savings.usdAmount > 0 ||
    savings.egpAmount > 0 ||
    savings.gold18Amount > 0 ||
    savings.gold21Amount > 0 ||
    savings.gold24Amount > 0;

  useEffect(() => {
    if (!savingsLoading && user && !hasSavedAmounts && activeTab !== "edit") {
      if (activeTab === "gold21-chart") {
        return;
      } else {
        setActiveTab("edit");
      }
    }
  }, [hasSavedAmounts, activeTab, savingsLoading, user, setActiveTab]);

  const tabItems: TabsProps["items"] = [
    {
      key: "edit",
      label: (
        <span>
          <EditOutlined /> Savings Quantity
        </span>
      ),
      children: (
        <EditTab
          savings={savings}
          setSavings={setSavings}
          onAfterSave={handleAfterSave}
        />
      ),
    },
    {
      key: "gold21-chart",
      label: (
        <span>
          <GoldOutlined /> Gold 21K Chart
        </span>
      ),
      children: <Gold21ChartTab allHistory={allHistory} />,
    },
    {
      key: "calculate",
      label: (
        <span>
          <CalculatorOutlined /> Savings Calculator
          {!hasSavedAmounts && <LockOutlined style={{ marginLeft: 4 }} />}
        </span>
      ),
      disabled: !hasSavedAmounts,
      children: (
        <CalculateTab
          savings={savings}
          allHistory={allHistory}
          setAllHistory={setAllHistory}
        />
      ),
    },
    {
      key: "quantity-history",
      label: (
        <span>
          <BarChartOutlined /> Savings Quantity History
          {!hasSavedAmounts && <LockOutlined style={{ marginLeft: 4 }} />}
        </span>
      ),
      disabled: !hasSavedAmounts,
      children: <QuantityHistoryTab quantityHistory={allHistory} />,
    },
    {
      key: "history",
      label: (
        <span>
          <HistoryOutlined /> History
          {!hasSavedAmounts && <LockOutlined style={{ marginLeft: 4 }} />}
        </span>
      ),
      disabled: !hasSavedAmounts,
      children: (
        <HistoryTab allHistory={allHistory} setAllHistory={setAllHistory} />
      ),
    },
  ];

  if (savingsLoading || historyLoading || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <Spin
          size="large"
          tip={
            !user
              ? "Checking authentication..."
              : "Loading your savings data..."
          }
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{ padding: "24px 16px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Card>
            <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
              Savings Calculator
            </Title>

            <Tabs
              activeKey={activeTab || "edit"}
              items={tabItems}
              onChange={(key) => setActiveTab(key as TabType)}
              size="large"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
