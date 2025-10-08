import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calories Tracker",
  description:
    "Track your daily calories, meals, exercises, and weight loss journey",
};

export default function CaloriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
