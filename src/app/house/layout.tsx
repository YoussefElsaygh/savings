import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "House Spending Tracker",
  description: "Track your total house expenses",
};

export default function HouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

