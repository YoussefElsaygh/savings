import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calories Tracker",
  description:
    "Track your daily calories, meals, exercises, and weight loss journey",
  icons: {
    icon: "/calories/icon.svg?v=4",
  },
};

export default function CaloriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
