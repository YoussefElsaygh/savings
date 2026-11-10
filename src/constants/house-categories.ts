export const HOUSE_CATEGORIES = ["Engineer", "Materials"] as const;

export type HouseCategory = (typeof HOUSE_CATEGORIES)[number];

export const UNCATEGORIZED_LABEL = "Uncategorized";
