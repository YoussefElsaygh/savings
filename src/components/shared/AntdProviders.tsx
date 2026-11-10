"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

// Client boundary for antd. Keeping antd out of the root (server) layout
// avoids a barrel-import module-id mismatch in the static export build.
export default function AntdProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#000000",
            borderRadius: 8,
            colorBorder: "#8c8c8c", // Darker borders
            colorBorderSecondary: "#a6a6a6", // Darker secondary borders
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
