"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { SavingsData, RateEntry, TabType, isTabType } from "@/types";
import { useSavingsDataFirebase, useRateHistoryFirebase } from "@/hooks/useFirebaseData";
import { hasSavingsDataInLocalStorage } from "@/utils/migration";
import EditTab from "@/components/savings/EditTab";
import CalculateTab from "@/components/savings/CalculateTab";
import QuantityHistoryTab from "@/components/savings/QuantityHistoryTab";
import HistoryTab from "@/components/savings/HistoryTab";
import Navbar from "@/components/shared/Navbar";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import SavingsMigrationModal from "@/components/savings/SavingsMigrationModal";

import Gold21ChartTab from "@/components/savings/Gold21ChartTab";
import { useRouter, useSearchParams } from "next/navigation";


export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
function HomeContent() {
  const [activeTab, setActiveTabProp] = useState<TabType | null>(null);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  
  // Firebase hooks
  const [savings, setSavings, savingsLoading, savingsError, user, signIn] = useSavingsDataFirebase();
  const [allHistory, setAllHistory, historyLoading, historyError] = useRateHistoryFirebase();
  
  const router = useRouter();

  const setActiveTab = useCallback(
    (tab: TabType) => {
      setActiveTabProp(tab);
      router.push(`/?tab=${tab}`);
    },
    [router]
  );
  const searchParams = useSearchParams();
  // Check for localStorage data and show migration modal
  useEffect(() => {
    if (user && !savingsLoading) {
      if (hasSavingsDataInLocalStorage()) {
        setShowMigrationModal(true);
      }
    }
  }, [user, savingsLoading]);

  // Check if there are any savings and set the appropriate active tab (only on initial load)
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
  }, [savingsLoading, user, searchParams, savings, setActiveTab]); // Include all dependencies

  // Function to switch to calculate tab after saving
  const handleAfterSave = () => {
    if (activeTab === "edit") {
      setActiveTab("calculate");
    }
  };

  // Check if user has any saved amounts to enable other tabs
  const hasSavedAmounts =
    savings.usdAmount > 0 ||
    savings.egpAmount > 0 ||
    savings.gold18Amount > 0 ||
    savings.gold21Amount > 0 ||
    savings.gold24Amount > 0;
  // Redirect to edit tab if current tab becomes disabled
  useEffect(() => {
    if (!savingsLoading && user && !hasSavedAmounts && activeTab !== "edit") {
      if (activeTab === "gold21-chart") {
        // Keep the current tab if it's gold21-chart (doesn't require savings)
        return;
      } else {
        setActiveTab("edit");
      }
    }
  }, [hasSavedAmounts, activeTab, savingsLoading, user, setActiveTab]);

  const tabs = [
    { id: "edit" as TabType, label: "Savings Quantity", disabled: false },
    { id: "gold21-chart" as TabType, label: "Gold 21K Chart", disabled: false },

    {
      id: "calculate" as TabType,
      label: "Savings Calculator",
      disabled: !hasSavedAmounts,
    },
    {
      id: "quantity-history" as TabType,
      label: "Savings Quantity History",
      disabled: !hasSavedAmounts,
    },
    { id: "history" as TabType, label: "History", disabled: !hasSavedAmounts },

  ];
  // Show sign-in interface if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="py-8">
          <div className="max-w-md mx-auto">
            <GoogleSignIn 
              user={user} 
              isLoading={savingsLoading} 
              error={savingsError} 
              onSignIn={signIn} 
            />
          </div>
        </div>
      </div>
    );
  }

  // Show loading while Firebase data is loading
  if (savingsLoading || historyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your savings data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          {/* User info */}
          <div className="mb-6">
            <GoogleSignIn 
              user={user} 
              isLoading={false} 
              error={null} 
              onSignIn={signIn} 
            />
          </div>
          
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Savings Calculator
          </h1>

          {/* Show migration button if localStorage data exists */}
          {hasSavingsDataInLocalStorage() && (
            <div className="mb-4">
              <button
                onClick={() => setShowMigrationModal(true)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                📦 Migrate LocalStorage Data to Firebase
              </button>
            </div>
          )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-green-500 text-white"
                  : tab.disabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
              }`}
              title={
                tab.disabled
                  ? "Save some savings amounts first to enable this tab"
                  : ""
              }
            >
              {tab.label}
              {tab.disabled && <span className="ml-1 text-xs">🔒</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="border border-gray-300 rounded-b-lg rounded-tr-lg p-6">
          {activeTab === "edit" && (
            <EditTab
              savings={savings}
              setSavings={setSavings}
              onAfterSave={handleAfterSave}
            />
          )}
          {activeTab === "calculate" && (
            <CalculateTab
              savings={savings}
              allHistory={allHistory}
              setAllHistory={setAllHistory}
            />
          )}
          {activeTab === "quantity-history" && (
            <QuantityHistoryTab quantityHistory={allHistory} />
          )}
          {activeTab === "history" && (
            <HistoryTab allHistory={allHistory} setAllHistory={setAllHistory} />
          )}

          {activeTab === "gold21-chart" && (
            <Gold21ChartTab allHistory={allHistory} />
          )}
        </div>
        </div>
      </div>
      
      {/* Migration Modal */}
      <SavingsMigrationModal
        isOpen={showMigrationModal}
        onClose={() => setShowMigrationModal(false)}
      />
    </div>
  );
}
