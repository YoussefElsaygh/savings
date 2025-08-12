"use client";

import { useState, useEffect, Suspense } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  SavingsData,
  RateEntry,
  TabType,
  isTabType,
  GoldPrice,
  USDPrice,
} from "@/types";
import { STORAGE_KEYS } from "@/constants/localStorage";
import EditTab from "@/components/EditTab";
import CalculateTab from "@/components/CalculateTab";
import QuantityHistoryTab from "@/components/QuantityHistoryTab";
import HistoryTab from "@/components/HistoryTab";
import { PricesTab } from "@/components/PricesTab";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const initialSavings: SavingsData = {
  usdAmount: 0,
  egpAmount: 0,
  gold18Amount: 0,
  gold21Amount: 0,
  gold24Amount: 0,
};
export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
function HomeContent() {
  const [goldPrices, setGoldPrices] = useState<GoldPrice | null>(null);
  const [usdPrices, setUSDPrices] = useState<USDPrice | null>(null);
  useEffect(() => {
    getRates();
  }, []);
  const [activeTab, setActiveTabProp] = useState<TabType | null>(null);
  const [savings, setSavings, savingsLoaded] = useLocalStorage<SavingsData>(
    STORAGE_KEYS.SAVINGS,
    initialSavings
  );
  const [allHistory, setAllHistory, allHistoryLoaded] = useLocalStorage<
    RateEntry[]
  >(STORAGE_KEYS.ALL_HISTORY, []);
  const setActiveTab = (tab: TabType) => {
    setActiveTabProp(tab);
    router.push(`/?tab=${tab}`);
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  // Check if there are any savings and set the appropriate active tab (only on initial load)
  useEffect(() => {
    if (savingsLoaded) {
      const hasSavings =
        savings.usdAmount > 0 ||
        savings.egpAmount > 0 ||
        savings.gold18Amount > 0 ||
        savings.gold21Amount > 0 ||
        savings.gold24Amount > 0;

      if (
        isTabType(searchParams.get("tab")) &&
        (hasSavings || activeTab === "prices")
      ) {
        setActiveTab(searchParams.get("tab") as TabType);
        return;
      }
      if (!hasSavings) {
        setActiveTab("edit");
      } else {
        setActiveTab("calculate");
      }
    }
  }, [savingsLoaded, searchParams]); // Only depend on savingsLoaded, not savings

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
    if (savingsLoaded && !hasSavedAmounts && activeTab !== "edit") {
      if (activeTab === "prices") {
        setActiveTab("prices");
      } else {
        setActiveTab("edit");
      }
    }
  }, [hasSavedAmounts, activeTab, savingsLoaded]);
  const getRates = () => {
    axios({
      method: "get",
      url: "https://www.goldapi.io/api/XAU/EGP",
      headers: { "x-access-token": "goldapi-1cey8cmsme6905k5-io" },
    }).then(function (response) {
      setGoldPrices(response.data);
    });
    axios({
      method: "get",
      url: "https://api.fastforex.io/fetch-multi?api_key=9702d86e30-d813d4bc59-t0voml&from=USD&to=EGP",
    }).then(function (response) {
      setUSDPrices(response.data);
    });
  };
  const tabs = [
    { id: "edit" as TabType, label: "Savings Quantity", disabled: false },
    { id: "prices" as TabType, label: "Rates", disabled: false },

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

  if (!savingsLoaded || !allHistoryLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Savings Calculator
        </h1>

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
              gold21Price={goldPrices?.price_gram_21k}
              usdPrice={usdPrices?.results.EGP}
            />
          )}
          {activeTab === "quantity-history" && (
            <QuantityHistoryTab quantityHistory={allHistory} />
          )}
          {activeTab === "history" && (
            <HistoryTab allHistory={allHistory} setAllHistory={setAllHistory} />
          )}
          {activeTab === "prices" && (
            <PricesTab
              goldPrices={goldPrices}
              usdPrice={usdPrices}
              refreshRates={getRates}
            />
          )}
        </div>
      </div>
    </div>
  );
}
