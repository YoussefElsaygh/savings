import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monthly Spending Tracker",
  description: "Track and analyze your monthly expenses by category",
};

export default function SpendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
