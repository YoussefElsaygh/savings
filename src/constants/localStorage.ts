/**
 * localStorage Keys Constants
 * Centralized storage keys to avoid typos and maintain consistency
 */

export const STORAGE_KEYS = {
  // Main application data
  SAVINGS: "savings",

  // History data
  ALL_HISTORY: "allHistory",

  // Legacy keys (for backward compatibility with original app)
  USD_AMOUNT: "usdAmount",
  EGP_AMOUNT: "egpAmount",
  GOLD_18_AMOUNT: "gold18Amount",
  GOLD_21_AMOUNT: "gold21Amount",
  GOLD_24_AMOUNT: "gold24Amount",
} as const;

// Type for localStorage keys
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
