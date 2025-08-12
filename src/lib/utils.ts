// Shared utility functions

import { RateEntry } from "@/types";

// Format date as dd/mm/yy hh:mm
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Format number to xxx,xxx.xx
export function formatNumber(value: number | null): string {
  if (!value) return "-";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Format number to xxx,xxx without decimal points for sums
export function formatSum(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// Calculate sum for a history entry
export function calculateHistorySum(entry: RateEntry): number {
  const usdValue = (entry?.usdAmount ?? 0) * (entry?.usdRate ?? 0);
  const gold18Value = (entry?.gold18Amount ?? 0) * (entry?.gold18Rate ?? 0);
  const gold21Value = (entry?.gold21Amount ?? 0) * (entry?.gold21Rate ?? 0);
  const gold24Value = (entry?.gold24Amount ?? 0) * (entry?.gold24Rate ?? 0);

  return (
    usdValue + gold21Value + gold24Value + gold18Value + (entry?.egpAmount ?? 0)
  );
}

// Get comparison class based on value change
export function getComparisonClass(
  currentSum: number,
  previousSum: number
): string {
  if (previousSum === 0) return "";
  const difference = currentSum - previousSum;
  if (difference === 0) return "no-change";
  return difference > 0 ? "increase" : "decrease";
}

// Get comparison icon
export function getComparisonIcon(
  currentSum: number,
  previousSum: number
): string {
  if (previousSum === 0) return "";
  const difference = currentSum - previousSum;
  if (difference === 0) return "→";
  return difference > 0 ? "↑" : "↓";
}
