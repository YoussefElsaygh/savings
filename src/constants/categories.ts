import { SpendingCategory } from "@/types";

export const DEFAULT_SPENDING_CATEGORIES: SpendingCategory[] = [
  {
    id: "food",
    name: "Food & Dining",
    color: "#FF6B6B",
    icon: "🍔",
  },
  {
    id: "transport",
    name: "Transportation",
    color: "#4ECDC4",
    icon: "🚗",
  },
  {
    id: "shopping",
    name: "Shopping",
    color: "#FFE66D",
    icon: "🛍️",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    color: "#95E1D3",
    icon: "🎬",
  },
  {
    id: "bills",
    name: "Bills & Utilities",
    color: "#A8E6CF",
    icon: "💡",
  },
  {
    id: "health",
    name: "Health & Fitness",
    color: "#FFB6C1",
    icon: "💊",
  },
  {
    id: "education",
    name: "Education",
    color: "#B4A7D6",
    icon: "📚",
  },
  {
    id: "other",
    name: "Other",
    color: "#D4A5A5",
    icon: "📦",
  },
];

// Helper function to get category by ID
export function getCategoryById(
  categoryId: string
): SpendingCategory | undefined {
  return DEFAULT_SPENDING_CATEGORIES.find((cat) => cat.id === categoryId);
}

// Helper function to get category name
export function getCategoryName(categoryId: string): string {
  return getCategoryById(categoryId)?.name || categoryId;
}

// Helper function to get category color
export function getCategoryColor(categoryId: string): string {
  return getCategoryById(categoryId)?.color || "#ccc";
}

// Helper function to get category icon
export function getCategoryIcon(categoryId: string): string {
  return getCategoryById(categoryId)?.icon || "📦";
}
