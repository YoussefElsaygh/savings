"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Radio,
  message,
} from "antd";
import {
  ThunderboltOutlined,
  FireOutlined,
  ToolOutlined,
  RocketOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  WorkoutPreferences,
  EquipmentPreference,
  ExperienceLevel,
} from "@/types";
import ModalContainer from "@/components/shared/ModalContainer";

const { Title, Text, Paragraph } = Typography;

interface WorkoutPreferencesModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (preferences: WorkoutPreferences) => void;
  currentPreferences?: WorkoutPreferences | null;
}

export default function WorkoutPreferencesModal({
  open,
  onClose,
  onSave,
  currentPreferences,
}: WorkoutPreferencesModalProps) {
  const [daysPerWeek, setDaysPerWeek] = useState<2 | 3 | 4>(3);
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("intermediate");
  const [equipmentPreference, setEquipmentPreference] =
    useState<EquipmentPreference>("mixed");

  useEffect(() => {
    if (currentPreferences) {
      setDaysPerWeek(currentPreferences.daysPerWeek);
      setExperienceLevel(currentPreferences.experienceLevel);
      setEquipmentPreference(currentPreferences.equipmentPreference);
    }
  }, [currentPreferences]);

  const handleSave = () => {
    const preferences: WorkoutPreferences = {
      daysPerWeek,
      experienceLevel,
      equipmentPreference,
      createdAt: currentPreferences?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(preferences);
    message.success("Workout preferences saved!");
    onClose();
  };

  return (
    <ModalContainer
      isOpen={open}
      onClose={onClose}
      title={
        <Space>
          <ToolOutlined style={{ color: "#722ed1" }} />
          <span>Customize Your Workout Plan</span>
        </Space>
      }
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={handleSave}
          style={{ background: "#722ed1" }}
        >
          Save Preferences
        </Button>,
      ]}
      maxWidth={800}
      heightMode="full"
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Training Frequency */}
        <div>
          <Title level={5}>
            <ThunderboltOutlined /> Training Frequency
          </Title>
          <Paragraph type="secondary">
            How many days per week do you want to train?
          </Paragraph>
          <Row gutter={16}>
            {[2, 3, 4].map((days) => (
              <Col key={days} xs={24} sm={8}>
                <Card
                  hoverable
                  onClick={() => setDaysPerWeek(days as 2 | 3 | 4)}
                  style={{
                    border:
                      daysPerWeek === days
                        ? "2px solid #722ed1"
                        : "1px solid #d9d9d9",
                    background: daysPerWeek === days ? "#f9f0ff" : "#fff",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <Title level={2} style={{ margin: 0, color: "#722ed1" }}>
                    {days}
                  </Title>
                  <Text>Days/Week</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Experience Level */}
        <div>
          <Title level={5}>
            <RocketOutlined /> Experience Level
          </Title>
          <Paragraph type="secondary">
            Choose your fitness experience level
          </Paragraph>
          <Radio.Group
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            style={{ width: "100%" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Card
                hoverable
                onClick={() => setExperienceLevel("beginner")}
                style={{
                  border:
                    experienceLevel === "beginner"
                      ? "2px solid #722ed1"
                      : "1px solid #d9d9d9",
                  background:
                    experienceLevel === "beginner" ? "#f9f0ff" : "#fff",
                  cursor: "pointer",
                }}
              >
                <Radio value="beginner">
                  <Space direction="vertical" size={0}>
                    <Text strong>Beginner</Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      New to training or returning after a long break
                    </Text>
                  </Space>
                </Radio>
              </Card>
              <Card
                hoverable
                onClick={() => setExperienceLevel("intermediate")}
                style={{
                  border:
                    experienceLevel === "intermediate"
                      ? "2px solid #722ed1"
                      : "1px solid #d9d9d9",
                  background:
                    experienceLevel === "intermediate" ? "#f9f0ff" : "#fff",
                  cursor: "pointer",
                }}
              >
                <Radio value="intermediate">
                  <Space direction="vertical" size={0}>
                    <Text strong>Intermediate</Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Training consistently for 6+ months
                    </Text>
                  </Space>
                </Radio>
              </Card>
              <Card
                hoverable
                onClick={() => setExperienceLevel("advanced")}
                style={{
                  border:
                    experienceLevel === "advanced"
                      ? "2px solid #722ed1"
                      : "1px solid #d9d9d9",
                  background:
                    experienceLevel === "advanced" ? "#f9f0ff" : "#fff",
                  cursor: "pointer",
                }}
              >
                <Radio value="advanced">
                  <Space direction="vertical" size={0}>
                    <Text strong>Advanced</Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Years of consistent training experience
                    </Text>
                  </Space>
                </Radio>
              </Card>
            </Space>
          </Radio.Group>
        </div>

        {/* Equipment Preference */}
        <div>
          <Title level={5}>
            <FireOutlined /> Equipment Preference
          </Title>
          <Paragraph type="secondary">
            What type of equipment do you prefer or have access to?
          </Paragraph>
          <Radio.Group
            value={equipmentPreference}
            onChange={(e) => setEquipmentPreference(e.target.value)}
            style={{ width: "100%" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Card
                hoverable
                onClick={() => setEquipmentPreference("free-weights")}
                style={{
                  border:
                    equipmentPreference === "free-weights"
                      ? "2px solid #722ed1"
                      : "1px solid #d9d9d9",
                  background:
                    equipmentPreference === "free-weights" ? "#f9f0ff" : "#fff",
                  cursor: "pointer",
                }}
              >
                <Radio value="free-weights">
                  <Space direction="vertical" size={0}>
                    <Text strong>🏋️ Free Weights</Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Barbells, dumbbells, and plates
                    </Text>
                  </Space>
                </Radio>
              </Card>
              <Card
                hoverable
                onClick={() => setEquipmentPreference("machines")}
                style={{
                  border:
                    equipmentPreference === "machines"
                      ? "2px solid #722ed1"
                      : "1px solid #d9d9d9",
                  background:
                    equipmentPreference === "machines" ? "#f9f0ff" : "#fff",
                  cursor: "pointer",
                }}
              >
                <Radio value="machines">
                  <Space direction="vertical" size={0}>
                    <Text strong>⚙️ Machines</Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Prefer machine-based exercises
                    </Text>
                  </Space>
                </Radio>
              </Card>
              <Card
                hoverable
                onClick={() => setEquipmentPreference("mixed")}
                style={{
                  border:
                    equipmentPreference === "mixed"
                      ? "2px solid #722ed1"
                      : "1px solid #d9d9d9",
                  background:
                    equipmentPreference === "mixed" ? "#f9f0ff" : "#fff",
                  cursor: "pointer",
                }}
              >
                <Radio value="mixed">
                  <Space direction="vertical" size={0}>
                    <Text strong>🔄 Mixed (Recommended)</Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Combination of free weights, machines, and cables
                    </Text>
                  </Space>
                </Radio>
              </Card>
              <Card
                hoverable
                onClick={() => setEquipmentPreference("bodyweight")}
                style={{
                  border:
                    equipmentPreference === "bodyweight"
                      ? "2px solid #722ed1"
                      : "1px solid #d9d9d9",
                  background:
                    equipmentPreference === "bodyweight" ? "#f9f0ff" : "#fff",
                  cursor: "pointer",
                }}
              >
                <Radio value="bodyweight">
                  <Space direction="vertical" size={0}>
                    <Text strong>💪 Bodyweight</Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Minimal equipment, bodyweight-focused training
                    </Text>
                  </Space>
                </Radio>
              </Card>
            </Space>
          </Radio.Group>
        </div>
      </Space>
    </ModalContainer>
  );
}
