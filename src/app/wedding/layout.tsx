import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Spending Tracker",
  description: "Track your total wedding expenses",
};

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

