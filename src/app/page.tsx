"use client";

import Link from "next/link";
import { Card, Typography, Row, Col } from "antd";
import {
  DollarOutlined,
  BankOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{ padding: "48px 16px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Title level={1}>Welcome to Personal Tracker</Title>
            <Paragraph style={{ fontSize: "16px", color: "#666" }}>
              Choose what you would like to track
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Link href="/savings" style={{ textDecoration: "none" }}>
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

            <Col xs={24} md={8}>
              <Link href="/spending" style={{ textDecoration: "none" }}>
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

            <Col xs={24} md={8}>
              <Link href="/calories" style={{ textDecoration: "none" }}>
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
          </Row>
        </div>
      </div>
    </div>
  );
}
