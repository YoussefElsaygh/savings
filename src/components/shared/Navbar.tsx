"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Typography, Avatar, Dropdown, Button, Space } from "antd";
import type { MenuProps } from "antd";
import {
  DollarOutlined,
  AppleOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  WalletOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  HomeOutlined,
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

  // Check if user is youssefelsaygh@gmail.com for hidden features
  const isSpecialUser = user?.email === "youssefelsaygh@gmail.com";

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
        // Hidden features for youssefelsaygh@gmail.com
        ...(isSpecialUser
          ? [
              {
                key: "/wedding",
                icon: <HeartOutlined />,
                label: <Link href="/wedding">Wedding</Link>,
              },
              {
                key: "/house",
                icon: <HomeOutlined />,
                label: <Link href="/house">House</Link>,
              },
            ]
          : []),
      ]
    : [];

  const getSelectedKey = () => {
    if (pathname === "/calories") return "/calories";
    if (pathname === "/savings") return "/savings";
    if (pathname === "/spending") return "/spending";
    if (pathname === "/workout") return "/workout";
    if (pathname === "/wedding") return "/wedding";
    if (pathname === "/house") return "/house";
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
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text
              strong
              style={{
                fontSize: "18px",
                padding: "16px 0",
                cursor: "pointer",
              }}
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
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
              >
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
                className="desktop-signin-btn"
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
            {/* Hidden features for youssefelsaygh@gmail.com */}
            {isSpecialUser && (
              <>
                <Link
                  href="/wedding"
                  className={`bottom-nav-item ${
                    pathname === "/wedding" ? "active" : ""
                  }`}
                >
                  <HeartOutlined style={{ fontSize: "24px" }} />
                  <span>Wedding</span>
                </Link>
                <Link
                  href="/house"
                  className={`bottom-nav-item ${
                    pathname === "/house" ? "active" : ""
                  }`}
                >
                  <HomeOutlined style={{ fontSize: "24px" }} />
                  <span>House</span>
                </Link>
              </>
            )}
          </>
        ) : (
          <div className="bottom-nav-signin-container">
            <button
              className="bottom-nav-signin-btn"
              onClick={handleSignIn}
              disabled={signingIn}
            >
              <LoginOutlined style={{ fontSize: "20px", marginRight: "8px" }} />
              <span>{signingIn ? "Signing in..." : "Sign In with Google"}</span>
            </button>
          </div>
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

        /* Sign-in container for bottom nav */
        .bottom-nav-signin-container {
          width: 100%;
          padding: 8px 16px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .bottom-nav-signin-btn {
          background: #000000;
          color: #ffffff;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          width: 100%;
          max-width: 320px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .bottom-nav-signin-btn:hover {
          background: #1a1a1a;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .bottom-nav-signin-btn:active {
          transform: translateY(0);
        }

        .bottom-nav-signin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Responsive styles */
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
          /* Hide desktop sign-in button on mobile */
          .desktop-signin-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
