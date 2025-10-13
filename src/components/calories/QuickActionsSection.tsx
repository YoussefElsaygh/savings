"use client";

import { useState } from "react";
import AddFoodModal from "./AddFoodModal";
import AddExerciseModal from "./AddExerciseModal";
import { Card, Button, Space, Typography } from "antd";
import {
  PlusOutlined,
  AppleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface QuickActionsSectionProps {
  handleModalAddFood: (foodData: {
    name: string;
    calories: number;
    description: string;
  }) => void;
  handleModalAddFoods?: (
    foods: Array<{
      name: string;
      calories: number;
      description: string;
    }>
  ) => Promise<void>;
  handleModalAddExercise: (exerciseData: {
    name: string;
    caloriesBurned: number;
    durationMinutes: number;
    description: string;
  }) => void;
  handleModalAddExercises?: (
    exercises: Array<{
      name: string;
      caloriesBurned: number;
      durationMinutes: number;
      description: string;
    }>
  ) => Promise<void>;
}

export default function QuickActionsSection({
  handleModalAddFood,
  handleModalAddFoods,
  handleModalAddExercise,
  handleModalAddExercises,
}: QuickActionsSectionProps) {
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  return (
    <>
      <Card
        style={{
          background: "#fafafa",
          borderColor: "#d9d9d9",
          textAlign: "center",
        }}
        title={
          <Space>
            <PlusOutlined style={{ fontSize: "18px" }} />
            <span>Track Your Activity</span>
          </Space>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Button
            size="large"
            icon={<AppleOutlined />}
            onClick={() => {
              setIsFoodModalOpen(true);
              document.body.style.overflow = "hidden";
            }}
            style={{
              width: "100%",
              borderColor: "#52c41a",
              color: "#52c41a",
              height: "48px",
              borderWidth: "2px",
            }}
          >
            Add Food
          </Button>
          <Button
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={() => {
              setIsExerciseModalOpen(true);
              document.body.style.overflow = "hidden";
            }}
            style={{
              width: "100%",
              borderColor: "#fa8c16",
              color: "#fa8c16",
              height: "48px",
              borderWidth: "2px",
            }}
          >
            Add Exercise
          </Button>
          <Text type="secondary" style={{ fontSize: "13px" }}>
            Track what you eat or your workout sessions
          </Text>
        </Space>
      </Card>

      <AddFoodModal
        isOpen={isFoodModalOpen}
        onClose={() => {
          setIsFoodModalOpen(false);
          document.body.style.overflow = "auto";
        }}
        onAddFood={handleModalAddFood}
        onAddFoods={handleModalAddFoods}
      />
      <AddExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={() => {
          setIsExerciseModalOpen(false);
          document.body.style.overflow = "auto";
        }}
        onAddExercise={handleModalAddExercise}
        onAddExercises={handleModalAddExercises}
      />
    </>
  );
}
