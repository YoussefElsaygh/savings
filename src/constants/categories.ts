import { SpendingCategory } from "@/types";

export const DEFAULT_SPENDING_CATEGORIES: SpendingCategory[] = [
  {
    id: "food",
    name: "Food & Dining",
    color: "#FF6B6B",
    icon: "🍔",
  },
  {
    id: "supermarket",
    name: "Supermarket",
    color: "#FFD700",
    icon: "🛒",
  },
  {
    id: "transport",
    name: "Transportation",
    color: "#4ECDC4",
    icon: "🚌",
  },
  {
    id: "car",
    name: "Car",
    color: "#FF4D4F",
    icon: "🚗",
  },
  {
    id: "fuel",
    name: "Fuel",
    color: "#FF4D4F",
    icon: "🛢️",
  },
  {
    id: "clothes",
    name: "Clothes",
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
    id: "gym",
    name: "Gym",
    color: "#FFB6C1",
    icon: "🏋️",
  },
  {
    id: "education",
    name: "Education",
    color: "#B4A7D6",
    icon: "📚",
  },
  {
    id: "gifts",
    name: "Gifts",
    color: "#B4A7D6",
    icon: "🎁",
  },
  {
    id: "rent",
    name: "Rent",
    color: "#B4A7D6",
    icon: "🏠",
  },
  {
    id: "wedding",
    name: "Wedding",
    color: "#B4A7D6",
    icon: "💒",
  },
  {
    id: "medication",
    name: "Medication",
    color: "#FFB6C1",
    icon: "💊",
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
