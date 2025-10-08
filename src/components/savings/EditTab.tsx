"use client";

import { useState, useEffect } from "react";
import { SavingsData } from "@/types";
import {
  Card,
  Input,
  Button,
  Space,
  Typography,
  message,
  Row,
  Col,
} from "antd";
import {
  DollarOutlined,
  GoldOutlined,
  SaveOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface EditTabProps {
  savings: SavingsData;
  setSavings: (savings: SavingsData) => Promise<void>;
  onAfterSave?: () => void;
}

export default function EditTab({
  savings,
  setSavings,
  onAfterSave,
}: EditTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<SavingsData>(savings);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setFormData(savings);
  }, [savings]);

  const handleInputChange = (field: keyof SavingsData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData({ ...formData, [field]: numValue });
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await setSavings(formData);
      messageApi.success("✅ Savings saved successfully to Firebase!");

      if (onAfterSave) {
        onAfterSave();
      }
    } catch (error) {
      console.error("Error saving savings data:", error);
      messageApi.error(
        `❌ Error: ${
          error instanceof Error ? error.message : "Failed to save data"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(savings);
    messageApi.info("Form reset to saved values");
  };

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Edit Your Savings</Title>
          <Text type="secondary">
            Update your savings quantities across different currencies and gold
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <DollarOutlined />
                  <span>Currency Holdings</span>
                </Space>
              }
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div>
                  <Text strong>USD Amount ($)</Text>
                  <Input
                    type="number"
                    step={0.01}
                    placeholder="Enter USD amount"
                    value={formData.usdAmount || ""}
                    onChange={(e) =>
                      handleInputChange("usdAmount", e.target.value)
                    }
                    size="large"
                    prefix={<DollarOutlined />}
                    style={{ marginTop: 8 }}
                  />
                </div>

                <div>
                  <Text strong>EGP Amount (EGP)</Text>
                  <Input
                    type="number"
                    step={0.01}
                    placeholder="Enter EGP amount"
                    value={formData.egpAmount || ""}
                    onChange={(e) =>
                      handleInputChange("egpAmount", e.target.value)
                    }
                    size="large"
                    prefix={<span>💵</span>}
                    style={{ marginTop: 8 }}
                  />
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <GoldOutlined style={{ color: "#faad14" }} />
                  <span>Gold Holdings</span>
                </Space>
              }
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div>
                  <Text strong>18K Gold Amount (grams)</Text>
                  <Input
                    type="number"
                    step={0.01}
                    placeholder="Enter 18K gold amount in grams"
                    value={formData.gold18Amount || ""}
                    onChange={(e) =>
                      handleInputChange("gold18Amount", e.target.value)
                    }
                    size="large"
                    prefix={<GoldOutlined />}
                    style={{ marginTop: 8 }}
                  />
                </div>

                <div>
                  <Text strong>21K Gold Amount (grams)</Text>
                  <Input
                    type="number"
                    step={0.01}
                    placeholder="Enter 21K gold amount in grams"
                    value={formData.gold21Amount || ""}
                    onChange={(e) =>
                      handleInputChange("gold21Amount", e.target.value)
                    }
                    size="large"
                    prefix={<GoldOutlined />}
                    style={{ marginTop: 8 }}
                  />
                </div>

                <div>
                  <Text strong>24K Gold Amount (grams)</Text>
                  <Input
                    type="number"
                    step={0.01}
                    placeholder="Enter 24K gold amount in grams"
                    value={formData.gold24Amount || ""}
                    onChange={(e) =>
                      handleInputChange("gold24Amount", e.target.value)
                    }
                    size="large"
                    prefix={<GoldOutlined />}
                    style={{ marginTop: 8 }}
                  />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Space size="middle">
          <Button
            size="large"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={isSaving}
            style={{
              borderColor: "#52c41a",
              color: "#52c41a",
              borderWidth: "2px",
            }}
          >
            {isSaving ? "Saving..." : "Save Amounts"}
          </Button>
          <Button
            size="large"
            icon={<ReloadOutlined />}
            onClick={handleReset}
            disabled={isSaving}
          >
            Reset
          </Button>
        </Space>
      </Space>
    </>
  );
}
