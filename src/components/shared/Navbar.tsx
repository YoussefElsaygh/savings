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
import { clearLoadedDataTracker } from "@/hooks/useFirebaseData";

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
      // Clear the loaded data tracker
      clearLoadedDataTracker();
      // Sign out from Firebase
      await signOutUser();
      // Clear all local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      // Redirect to home page after signing out
      router.push("/");
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
      {/* Top Navigation Bar - Desktop and Header on Mobile */}
      <nav
        style={{
          borderBottom: "1px solid #f0f0f0",
          background: "#fff",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          paddingTop: "env(safe-area-inset-top, 0px)",
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

      {/* Bottom Navigation - Mobile Only */}
      <nav className="bottom-nav">
        {user ? (
          <>
            <Link
              href="/savings"
              className={`bottom-nav-item ${
                pathname === "/savings" ? "active" : ""
              }`}
            >
              <DollarOutlined style={{ fontSize: "24px" }} />
              <span>Savings</span>
            </Link>
            <Link
              href="/spending"
              className={`bottom-nav-item ${
                pathname === "/spending" ? "active" : ""
              }`}
            >
              <WalletOutlined style={{ fontSize: "24px" }} />
              <span>Spending</span>
            </Link>
            <Link
              href="/calories"
              className={`bottom-nav-item ${
                pathname === "/calories" ? "active" : ""
              }`}
            >
              <AppleOutlined style={{ fontSize: "24px" }} />
              <span>Calories</span>
            </Link>
            <Link
              href="/workout"
              className={`bottom-nav-item ${
                pathname === "/workout" ? "active" : ""
              }`}
            >
              <ThunderboltOutlined style={{ fontSize: "24px" }} />
              <span>Workout</span>
            </Link>
          </>
        ) : (
          <button
            className="bottom-nav-item bottom-nav-signin"
            onClick={handleSignIn}
            disabled={signingIn}
          >
            <LoginOutlined style={{ fontSize: "24px" }} />
            <span>{signingIn ? "Signing in..." : "Sign In"}</span>
          </button>
        )}
      </nav>

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

        /* Bottom Navigation Styles - Mobile App Like */
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-top: 1px solid #f0f0f0;
          padding: 8px 0;
          padding-bottom: max(8px, env(safe-area-inset-bottom));
          z-index: 1000;
          box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
          justify-content: space-around;
          align-items: center;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          color: #8c8c8c;
          text-decoration: none;
          transition: all 0.2s ease;
          flex: 1;
          gap: 4px;
          -webkit-tap-highlight-color: transparent;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .bottom-nav-item span {
          font-size: 12px;
          font-weight: 500;
        }

        .bottom-nav-item.active {
          color: #000000;
        }

        .bottom-nav-item:active {
          transform: scale(0.95);
          background: #f5f5f5;
          border-radius: 8px;
        }

        .bottom-nav-signin {
          width: 100%;
          color: #000000 !important;
        }

        .bottom-nav-signin:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Top navbar in dark mode */
        @media (prefers-color-scheme: dark) {
          nav[style*="position: fixed"] {
            background: #0a0a0a !important;
            border-bottom-color: #262626 !important;
          }

          .bottom-nav {
            background: #0a0a0a;
            border-top-color: #262626;
          }

          .bottom-nav-item {
            color: #8c8c8c;
          }

          .bottom-nav-item.active {
            color: #ededed;
          }

          .bottom-nav-item:active {
            background: #1a1a1a;
          }
        }

        @media (min-width: 769px) {
          .desktop-menu {
            display: flex !important;
          }
          .bottom-nav {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .bottom-nav {
            display: flex !important;
          }
          .user-name {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
