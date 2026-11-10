"use client";

import Link from "next/link";
import { Card, Typography, Row, Col } from "antd";
import {
  DollarOutlined,
  BankOutlined,
  ShoppingOutlined,
  HeartOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isSpecialUserEmail } from "@/lib/specialUser";

const { Title, Paragraph } = Typography;

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isSpecialUser = isSpecialUserEmail(user?.email);

  // Prefetch all pages on mount for instant navigation
  useEffect(() => {
    router.prefetch("/savings");
    router.prefetch("/spending");
    router.prefetch("/calories");
  }, [router]);

  useEffect(() => {
    if (isSpecialUser) {
      router.prefetch("/wedding");
      router.prefetch("/house");
    }
  }, [router, isSpecialUser]);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{ padding: "48px 16px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Title level={1}>Welcome to Fitness & Finance Tracker</Title>
            <Paragraph style={{ fontSize: "16px", color: "#666" }}>
              Track your finances, health, and fitness goals all in one place
            </Paragraph>
          </div>

          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={12}>
              <Link
                href="/savings"
                prefetch={true}
                style={{ textDecoration: "none" }}
              >
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    textAlign: "center",
                    border: "2px solid #f0f0f0",
                    transition: "all 0.3s",
                  }}
                  bodyStyle={{ padding: "48px 24px" }}
                >
                  <DollarOutlined
                    style={{
                      fontSize: "64px",
                      color: "#52c41a",
                      marginBottom: "24px",
                    }}
                  />
                  <Title level={2} style={{ marginBottom: "16px" }}>
                    Savings
                  </Title>
                  <Paragraph style={{ fontSize: "16px", color: "#666" }}>
                    Track your savings across USD, EGP, and Gold. Calculate your
                    total worth.
                  </Paragraph>
                </Card>
              </Link>
            </Col>

            <Col xs={24} sm={12} md={12}>
              <Link
                href="/spending"
                prefetch={true}
                style={{ textDecoration: "none" }}
              >
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    textAlign: "center",
                    border: "2px solid #f0f0f0",
                    transition: "all 0.3s",
                  }}
                  bodyStyle={{ padding: "48px 24px" }}
                >
                  <BankOutlined
                    style={{
                      fontSize: "64px",
                      color: "#FFD700",
                      marginBottom: "24px",
                    }}
                  />
                  <Title level={2} style={{ marginBottom: "16px" }}>
                    Spending
                  </Title>
                  <Paragraph style={{ fontSize: "16px", color: "#666" }}>
                    Track monthly expenses by category. Visualize spending
                    patterns with charts.
                  </Paragraph>
                </Card>
              </Link>
            </Col>

            <Col xs={24} sm={12} md={12}>
              <Link
                href="/calories"
                prefetch={true}
                style={{ textDecoration: "none" }}
              >
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    textAlign: "center",
                    border: "2px solid #f0f0f0",
                    transition: "all 0.3s",
                  }}
                  bodyStyle={{ padding: "48px 24px" }}
                >
                  <ShoppingOutlined
                    style={{
                      fontSize: "64px",
                      color: "#ff4d4f",
                      marginBottom: "24px",
                    }}
                  />
                  <Title level={2} style={{ marginBottom: "16px" }}>
                    Calories
                  </Title>
                  <Paragraph style={{ fontSize: "16px", color: "#666" }}>
                    Track daily calorie intake and exercise. Achieve your weight
                    loss targets.
                  </Paragraph>
                </Card>
              </Link>
            </Col>

            {isSpecialUser && (
              <>
                <Col xs={24} sm={12} md={12}>
                  <Link
                    href="/wedding"
                    prefetch={true}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      hoverable
                      style={{
                        height: "100%",
                        textAlign: "center",
                        border: "2px solid #f0f0f0",
                        transition: "all 0.3s",
                      }}
                      bodyStyle={{ padding: "48px 24px" }}
                    >
                      <HeartOutlined
                        style={{
                          fontSize: "64px",
                          color: "#eb2f96",
                          marginBottom: "24px",
                        }}
                      />
                      <Title level={2} style={{ marginBottom: "16px" }}>
                        Wedding
                      </Title>
                      <Paragraph style={{ fontSize: "16px", color: "#666" }}>
                        Track wedding expenses by category and see where the
                        money goes.
                      </Paragraph>
                    </Card>
                  </Link>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Link
                    href="/house"
                    prefetch={true}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      hoverable
                      style={{
                        height: "100%",
                        textAlign: "center",
                        border: "2px solid #f0f0f0",
                        transition: "all 0.3s",
                      }}
                      bodyStyle={{ padding: "48px 24px" }}
                    >
                      <HomeOutlined
                        style={{
                          fontSize: "64px",
                          color: "#1677ff",
                          marginBottom: "24px",
                        }}
                      />
                      <Title level={2} style={{ marginBottom: "16px" }}>
                        House
                      </Title>
                      <Paragraph style={{ fontSize: "16px", color: "#666" }}>
                        Track house expenses and costs in one place.
                      </Paragraph>
                    </Card>
                  </Link>
                </Col>
              </>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
}
