import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workout Tracker",
  description: "Track your workouts, PRs, and progress",
};

export default function WorkoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
