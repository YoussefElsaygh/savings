import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Savings & Gold Tracker",
  description: "Track your savings, gold, and assets",
  icons: {
    icon: "/savings/icon.png",
  },
};

export default function SavingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
