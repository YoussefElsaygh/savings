"use client";

import { useState, useEffect } from "react";
import { CalorieGoal } from "@/types";
import { formatNumber } from "@/lib/utils";
import {
  Card,
  Button,
  Input,
  InputNumber,
  Space,
  Typography,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface CalorieGoalSectionProps {
  calorieGoal: CalorieGoal | null;
  onSaveGoal: (goal: CalorieGoal) => void;
}

export default function CalorieGoalSection({
  calorieGoal,
  onSaveGoal,
}: CalorieGoalSectionProps) {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [maintenanceCalories, setMaintenanceCalories] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [targetWeightLoss, setTargetWeightLoss] = useState("");
  const [totalCaloriesToLose, setTotalCaloriesToLose] = useState("");

  useEffect(() => {
    if (calorieGoal && showGoalForm) {
      setMaintenanceCalories(calorieGoal.maintenanceCalories?.toString() || "");
      setDailyLimit(calorieGoal.dailyCalorieLimit.toString());
      setTargetWeightLoss(calorieGoal.targetWeightLoss.toString());
      setTotalCaloriesToLose(calorieGoal.totalCaloriesToLose?.toString() || "");
    }
  }, [calorieGoal, showGoalForm]);

  const handleSaveGoal = () => {
    const maintenance = parseFloat(maintenanceCalories);
    const limit = parseFloat(dailyLimit);
    const weightLoss = parseFloat(targetWeightLoss);
    const totalCalories = parseFloat(totalCaloriesToLose);

    if (maintenance > 0 && limit > 0 && weightLoss > 0 && totalCalories > 0) {
      const newGoal: CalorieGoal = {
        maintenanceCalories: maintenance,
        dailyCalorieLimit: limit,
        targetWeightLoss: weightLoss,
        totalCaloriesToLose: totalCalories,
        createdAt: new Date().toISOString(),
      };

      onSaveGoal(newGoal);
      setShowGoalForm(false);
      setMaintenanceCalories("");
      setDailyLimit("");
      setTargetWeightLoss("");
      setTotalCaloriesToLose("");
    }
  };

  const handleCancel = () => {
    setShowGoalForm(false);
    setMaintenanceCalories("");
    setDailyLimit("");
    setTargetWeightLoss("");
    setTotalCaloriesToLose("");
  };

  return (
    <Card
      style={{ background: "#e6f4ff", borderColor: "#91caff" }}
      title={
        <Space>
          <TrophyOutlined style={{ fontSize: "18px" }} />
          <span>Calorie Goal</span>
        </Space>
      }
      extra={
        <Button
          icon={<EditOutlined />}
          onClick={() => setShowGoalForm(!showGoalForm)}
          style={{
            borderColor: "#000000",
            color: "#000000",
            borderWidth: "2px",
          }}
        >
          {calorieGoal ? "Edit Goal" : "Set Goal"}
        </Button>
      }
    >
      {calorieGoal && !showGoalForm && (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Maintenance Calories:</Text>
            <Text strong>
              {formatNumber(calorieGoal.maintenanceCalories || 0)} cal
            </Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Daily Target:</Text>
            <Text strong>
              {formatNumber(calorieGoal.dailyCalorieLimit)} cal
            </Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Target Weight Loss:</Text>
            <Text strong>{calorieGoal.targetWeightLoss} kg</Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Total Calories to Lose:</Text>
            <Text strong>
              {formatNumber(calorieGoal.totalCaloriesToLose || 0)} cal
            </Text>
          </div>
        </Space>
      )}

      {!calorieGoal && !showGoalForm && (
        <Text type="secondary">
          Set your calorie goal to start tracking your progress
        </Text>
      )}

      {showGoalForm && (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Maintenance Calories
              </Text>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="e.g. 2000"
                value={
                  maintenanceCalories ? parseFloat(maintenanceCalories) : null
                }
                onChange={(val) =>
                  setMaintenanceCalories(val?.toString() || "")
                }
                min={0}
                step={50}
                size="large"
              />
            </Col>
            <Col span={12}>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Daily Calorie Limit
              </Text>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="e.g. 1500"
                value={dailyLimit ? parseFloat(dailyLimit) : null}
                onChange={(val) => setDailyLimit(val?.toString() || "")}
                min={0}
                step={50}
                size="large"
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Target Weight Loss (kg)
              </Text>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="e.g. 10"
                value={targetWeightLoss ? parseFloat(targetWeightLoss) : null}
                onChange={(val) => setTargetWeightLoss(val?.toString() || "")}
                min={0}
                step={0.5}
                size="large"
              />
            </Col>
            <Col span={12}>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Total Calories to Lose
              </Text>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="e.g. 77000"
                value={
                  totalCaloriesToLose ? parseFloat(totalCaloriesToLose) : null
                }
                onChange={(val) =>
                  setTotalCaloriesToLose(val?.toString() || "")
                }
                min={0}
                step={1000}
                size="large"
              />
            </Col>
          </Row>

          <Space>
            <Button
              icon={<SaveOutlined />}
              onClick={handleSaveGoal}
              disabled={
                !maintenanceCalories ||
                !dailyLimit ||
                !targetWeightLoss ||
                !totalCaloriesToLose
              }
              style={{
                borderColor: "#52c41a",
                color: "#52c41a",
                borderWidth: "2px",
              }}
            >
              Save Goal
            </Button>
            <Button icon={<CloseOutlined />} onClick={handleCancel}>
              Cancel
            </Button>
          </Space>
        </Space>
      )}
    </Card>
  );
}
