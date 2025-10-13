"use client";

import { useState } from "react";
import { CalorieGoal } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Card, Button, Space, Typography } from "antd";
import { TrophyOutlined, CalculatorOutlined } from "@ant-design/icons";
import CalorieCalculatorModal from "./CalorieCalculatorModal";

const { Text } = Typography;

interface CalorieGoalSectionProps {
  calorieGoal: CalorieGoal | null;
  onSaveGoal: (goal: CalorieGoal) => void;
}

export default function CalorieGoalSection({
  calorieGoal,
  onSaveGoal,
}: CalorieGoalSectionProps) {
  const [showCalculator, setShowCalculator] = useState(false);

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
          icon={<CalculatorOutlined />}
          onClick={() => setShowCalculator(true)}
          style={{
            borderColor: "#1890ff",
            color: "#1890ff",
            borderWidth: "2px",
          }}
        >
          {calorieGoal ? "Edit Goal" : "Set Goal"}
        </Button>
      }
    >
      {calorieGoal && (
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
          {calorieGoal.targetWeightLoss > 0 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Target Rate:</Text>
                <Text strong>
                  {calorieGoal.targetWeightLoss.toFixed(2)} kg/week
                </Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Daily Deficit:</Text>
                <Text strong>
                  {formatNumber(
                    calorieGoal.maintenanceCalories -
                      calorieGoal.dailyCalorieLimit
                  )}{" "}
                  cal/day
                </Text>
              </div>
            </>
          )}
          {calorieGoal.totalCaloriesToLose > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Total Calories to Lose:</Text>
              <Text strong>
                {formatNumber(calorieGoal.totalCaloriesToLose || 0)} cal
              </Text>
            </div>
          )}
        </Space>
      )}

      {!calorieGoal && (
        <Text type="secondary">
          Use the calculator to set your personalized calorie goal based on your
          age, weight, height, and activity level
        </Text>
      )}

      {/* Calorie Calculator Modal */}
      <CalorieCalculatorModal
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        onSaveGoal={onSaveGoal}
        existingGoal={calorieGoal}
      />
    </Card>
  );
}
