"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Typography,
  Avatar,
  Dropdown,
  Button,
  Space,
  Drawer,
  ConfigProvider,
} from "antd";
import type { MenuProps } from "antd";
import {
  DollarOutlined,
  AppleOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  MenuOutlined,
  WalletOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth, signInWithGoogle, signOutUser } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";

const { Text } = Typography;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const navItems: MenuProps["items"] = user
    ? [
        {
          key: "/savings",
          icon: <DollarOutlined />,
          label: <Link href="/savings">Savings</Link>,
        },
        {
          key: "/spending",
          icon: <WalletOutlined />,
          label: <Link href="/spending">Spending</Link>,
        },
        {
          key: "/calories",
          icon: <AppleOutlined />,
          label: <Link href="/calories">Calories</Link>,
        },
        {
          key: "/workout",
          icon: <ThunderboltOutlined />,
          label: <Link href="/workout">Workout</Link>,
        },
      ]
    : [];

  const drawerItems: MenuProps["items"] = user
    ? [
        {
          key: "/savings",
          icon: <DollarOutlined />,
          label: "Savings",
          onClick: () => {
            router.push("/savings");
            setDrawerOpen(false);
          },
        },
        {
          key: "/spending",
          icon: <WalletOutlined />,
          label: "Spending",
          onClick: () => {
            router.push("/spending");
            setDrawerOpen(false);
          },
        },
        {
          key: "/calories",
          icon: <AppleOutlined />,
          label: "Calories",
          onClick: () => {
            router.push("/calories");
            setDrawerOpen(false);
          },
        },
        {
          key: "/workout",
          icon: <ThunderboltOutlined />,
          label: "Workout",
          onClick: () => {
            router.push("/workout");
            setDrawerOpen(false);
          },
        },
      ]
    : [];

  const getSelectedKey = () => {
    if (pathname === "/calories") return "/calories";
    if (pathname === "/savings") return "/savings";
    if (pathname === "/spending") return "/spending";
    if (pathname === "/workout") return "/workout";
    return "/";
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "signout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      onClick: handleSignOut,
    },
  ];

  return (
    <>
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
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text
              strong
              style={{ fontSize: "18px", padding: "16px 0", cursor: "pointer" }}
            >
              Personal Tracker
            </Text>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Desktop Menu - hidden on small screens */}
            {user && navItems.length > 0 && (
              <ConfigProvider
                theme={{
                  components: {
                    Menu: {
                      itemSelectedBg: "#f0f0f0",
                      itemSelectedColor: "#000000",
                      horizontalItemSelectedBg: "#f0f0f0",
                      horizontalItemSelectedColor: "#000000",
                    },
                  },
                }}
              >
                <Menu
                  mode="horizontal"
                  selectedKeys={[getSelectedKey()]}
                  items={navItems}
                  style={{
                    border: "none",
                    minWidth: "500px",
                  }}
                  className="desktop-menu"
                />
              </ConfigProvider>
            )}

            {/* Mobile Menu Button - shown on small screens */}
            {user && drawerItems.length > 0 && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
                className="mobile-menu-button"
                style={{ display: "none" }}
              />
            )}

            {authLoading ? (
              <Avatar icon={<UserOutlined />} style={{ opacity: 0.5 }} />
            ) : user ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space style={{ cursor: "pointer" }}>
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={32}
                      height={32}
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    <Avatar icon={<UserOutlined />} />
                  )}
                  <Text className="user-name">
                    {user.displayName || user.email}
                  </Text>
                </Space>
              </Dropdown>
            ) : (
              <Button
                type="primary"
                icon={<LoginOutlined />}
                onClick={handleSignIn}
                loading={signingIn}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        title=""
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
      >
        <Menu
          mode="vertical"
          selectedKeys={[getSelectedKey()]}
          items={drawerItems}
          style={{ border: "none" }}
          className="drawer-menu"
        />
      </Drawer>

      <style jsx global>{`
        /* Desktop menu styling with higher specificity */
        .desktop-menu.ant-menu-horizontal .ant-menu-item-selected {
          background-color: #f0f0f0 !important;
          color: #000000 !important;
        }

        .desktop-menu.ant-menu-horizontal .ant-menu-item-selected a {
          color: #000000 !important;
        }

        .desktop-menu.ant-menu-horizontal .ant-menu-item-selected::after {
          border-bottom-color: #000000 !important;
          border-bottom-width: 2px !important;
        }

        .desktop-menu.ant-menu-horizontal .ant-menu-item:hover {
          background-color: #fafafa !important;
        }

        .desktop-menu.ant-menu-horizontal
          .ant-menu-item:hover:not(.ant-menu-item-selected) {
          color: rgba(0, 0, 0, 0.88) !important;
        }

        /* Mobile drawer menu styling */
        .drawer-menu .ant-menu-item-selected {
          background-color: #f0f0f0 !important;
          color: #000000 !important;
        }

        .drawer-menu .ant-menu-item-selected::after {
          border-right-color: #000000 !important;
        }

        .drawer-menu .ant-menu-item:hover {
          background-color: #fafafa !important;
        }

        @media (min-width: 769px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-menu-button {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-button {
            display: inline-flex !important;
          }
          .user-name {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
