"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Typography } from "antd";
import type { MenuProps } from "antd";
import { DollarOutlined, AppleOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function Navbar() {
  const pathname = usePathname();

  const items: MenuProps["items"] = [
    {
      key: "/",
      icon: <DollarOutlined />,
      label: <Link href="/">Savings</Link>,
    },
    {
      key: "/calories",
      icon: <AppleOutlined />,
      label: <Link href="/calories">Calories</Link>,
    },
  ];

  const selectedKey = pathname === "/calories" ? "/calories" : "/";

  return (
    <nav
      style={{
        borderBottom: "1px solid #f0f0f0",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text strong style={{ fontSize: "18px", padding: "16px 0" }}>
          Personal Tracker
        </Text>
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={items}
          style={{
            border: "none",
            flex: 1,
            justifyContent: "flex-end",
            minWidth: 0,
          }}
        />
      </div>
    </nav>
  );
}
