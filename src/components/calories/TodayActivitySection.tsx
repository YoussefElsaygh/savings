"use client";

import { useState } from "react";
import { DailyCalorieData } from "@/types";
import { formatNumber } from "@/lib/utils";
import AddFoodModal from "./AddFoodModal";
import { Card, Space, Typography, Button, List, Tag } from "antd";
import { AppleOutlined, ThunderboltOutlined, CloseOutlined, ClockCircleOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface TodayActivitySectionProps {
  todayData: DailyCalorieData;
  onDeleteFood: (foodId: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onEditFood: (
    foodId: string,
    date: string,
    updatedFood: { name: string; calories: number }
  ) => Promise<void>;
}

export default function TodayActivitySection({
  todayData,
  onDeleteFood,
  onDeleteExercise,
  onEditFood,
}: TodayActivitySectionProps) {
  const [editFoodModalOpen, setEditFoodModalOpen] = useState(false);
  const [foodToEdit, setFoodToEdit] = useState<{
    id: string;
    name: string;
    calories: number;
    date: string;
    isPreset?: boolean;
    presetFoodId?: string;
    presetFoodName?: string;
    quantity?: number;
    unit?: "pieces" | "grams" | "ml";
    caloriesPerUnit?: number;
    unitType?: "piece" | "100g" | "100ml";
  } | null>(null);

  const hasActivity =
    todayData.foodEntries.length > 0 ||
    (todayData.exerciseEntries && todayData.exerciseEntries.length > 0);

  const handleEditFoodClick = (entry: {
    id: string;
    name: string;
    calories: number;
    isPreset?: boolean;
    presetFoodId?: string;
    presetFoodName?: string;
    quantity?: number;
    unit?: "pieces" | "grams" | "ml";
    caloriesPerUnit?: number;
    unitType?: "piece" | "100g" | "100ml";
  }) => {
    setFoodToEdit({
      id: entry.id,
      name: entry.name,
      calories: entry.calories,
      date: todayData.date,
      isPreset: entry.isPreset,
      presetFoodId: entry.presetFoodId,
      presetFoodName: entry.presetFoodName,
      quantity: entry.quantity,
      unit: entry.unit,
      caloriesPerUnit: entry.caloriesPerUnit,
      unitType: entry.unitType,
    });
    setEditFoodModalOpen(true);
  };

  const handleCloseEditFoodModal = () => {
    setEditFoodModalOpen(false);
    setFoodToEdit(null);
  };

  if (!hasActivity) return null;

  return (
    <Card title="Today's Activity">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Food Entries */}
        {todayData.foodEntries.length > 0 && (
          <div>
            <Title level={5} style={{ marginBottom: 16 }}>
              <AppleOutlined style={{ marginRight: 8 }} />
              Food Entries ({todayData.foodEntries.length} items)
            </Title>
            <List
              dataSource={todayData.foodEntries}
              renderItem={(entry) => (
                <List.Item
                  key={entry.id}
                  style={{
                    background: "#f6ffed",
                    padding: "12px",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    border: "1px solid #b7eb8f",
                  }}
                  extra={
                    <Space>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditFoodClick(entry)}
                        title="Edit food entry"
                        style={{ color: "#1890ff" }}
                      />
                      <Button
                        type="text"
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => onDeleteFood(entry.id)}
                        title="Delete food entry"
                      />
                    </Space>
                  }
                >
                  <List.Item.Meta
                    title={<Text strong>{entry.name}</Text>}
                    description={
                      <Space size="small">
                        <Tag icon={<ClockCircleOutlined />} color="green">
                          {new Date(entry.timestamp).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </Tag>
                        <Tag color="green">
                          {formatNumber(entry.calories)} calories
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}

        {/* Exercise Entries */}
        {todayData.exerciseEntries && todayData.exerciseEntries.length > 0 && (
          <div>
            <Title level={5} style={{ marginBottom: 16 }}>
              <ThunderboltOutlined style={{ marginRight: 8 }} />
              Exercise Entries ({todayData.exerciseEntries.length} items)
            </Title>
            <List
              dataSource={todayData.exerciseEntries}
              renderItem={(entry) => (
                <List.Item
                  key={entry.id}
                  style={{
                    background: "#fff7e6",
                    padding: "12px",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    border: "1px solid #ffd591",
                  }}
                  extra={
                    <Button
                      type="text"
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => onDeleteExercise(entry.id)}
                      title="Delete exercise entry"
                    />
                  }
                >
                  <List.Item.Meta
                    title={<Text strong>{entry.name}</Text>}
                    description={
                      <Space size="small">
                        <Tag icon={<ClockCircleOutlined />} color="orange">
                          {new Date(entry.timestamp).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </Tag>
                        <Tag color="orange">
                          {entry.durationMinutes} min
                        </Tag>
                        <Tag color="orange">
                          {formatNumber(entry.caloriesBurned)} cal burned
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Space>

      {/* Edit Food Modal */}
      {foodToEdit && (
        <AddFoodModal
          isOpen={editFoodModalOpen}
          onClose={handleCloseEditFoodModal}
          onAddFood={() => {}}
          editMode={true}
          editFoodData={foodToEdit}
          onEditFood={onEditFood}
        />
      )}
    </Card>
  );
}
