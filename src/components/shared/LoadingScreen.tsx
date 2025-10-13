"use client";

import { useEffect } from "react";
import { Spin } from "antd";

interface LoadingScreenProps {
  tip?: string;
}

export default function LoadingScreen({
  tip = "Loading...",
}: LoadingScreenProps) {
  // Prevent body scroll when loading
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(245, 245, 245, 0.95)",
        zIndex: 9999,
      }}
    >
      <Spin size="large" tip={tip} />
    </div>
  );
}
