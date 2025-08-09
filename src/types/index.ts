export interface SavingsData {
  usdAmount: number;
  egpAmount: number;
  gold18Amount: number;
  gold21Amount: number;
  gold24Amount: number;
}

export interface RateEntry {
  id: string;
  timestamp: string;
  usdRate: number;
  gold18Rate: number;
  gold21Rate: number;
  gold24Rate: number;
  gold18Amount: number;
  gold21Amount: number;
  gold24Amount: number;
  egpAmount: number;
  usdAmount: number;
  sum: number;
}

export type TabType = "edit" | "calculate" | "quantity-history" | "history";
