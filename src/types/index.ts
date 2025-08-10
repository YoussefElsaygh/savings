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
export interface GoldPrice {
  ask: number;
  bid: number;
  ch: number;
  currency: string;
  exchange: string;
  metal: string;
  open_time: number;
  price: number;
  price_gram_10k: number;
  price_gram_14k: number;
  price_gram_16k: number;
  price_gram_18k: number;
  price_gram_20k: number;
  price_gram_21k: number;
  price_gram_22k: number;
  price_gram_24k: number;
  symbol: string;
  timestamp: number;
}

export type TabType =
  | "edit"
  | "calculate"
  | "quantity-history"
  | "history"
  | "gold-prices";

export function isTabType(value: unknown): value is TabType {
  return [
    "edit",
    "calculate",
    "quantity-history",
    "history",
    "gold-prices",
  ].includes(value as TabType);
}
