"use client";

import { useState } from "react";
import { CalorieGoal, DailyCalorieData } from "@/types";
import { formatNumber } from "@/lib/utils";
import AddFoodModal from "./AddFoodModal";
import {
  Card,
  Space,
  Typography,
  Button,
  Tag,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  CalendarOutlined,
  EditOutlined,
  FireOutlined,
  ThunderboltOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface CalorieHistorySectionProps {
  dailyData: DailyCalorieData[];
  calorieGoal: CalorieGoal | null;
  normalizeData: (data: DailyCalorieData[]) => DailyCalorieData[];
  getTotalDeficitAchieved: () => number;
  getTodayDate: () => string;
  onEditDay: (date: string) => void;
  onEditFood: (
    foodId: string,
    date: string,
    updatedFood: { name: string; calories: number }
  ) => Promise<void>;
}

export default function CalorieHistorySection({
  dailyData,
  calorieGoal,
  normalizeData,
  getTotalDeficitAchieved,
  getTodayDate,
  onEditDay,
  onEditFood,
}: CalorieHistorySectionProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
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

  const toggleDay = (date: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDays(newExpanded);
  };

  const handleEditFoodClick = (
    entry: {
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
    },
    date: string
  ) => {
    setFoodToEdit({
      id: entry.id,
      name: entry.name,
      calories: entry.calories,
      date,
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

  if (dailyData.length === 0) return null;

  const deficitDaysCount = normalizeData(dailyData).filter((day) => {
    const foodDeficit = calorieGoal?.maintenanceCalories
      ? Math.max(calorieGoal.maintenanceCalories - day.totalCalories, 0)
      : 0;
    const exerciseBonus = day.totalCaloriesBurned || 0;
    return foodDeficit + exerciseBonus > 0;
  }).length;

  const totalActivities = normalizeData(dailyData).reduce(
    (sum, day) =>
      sum + day.foodEntries.length + (day.exerciseEntries?.length || 0),
    0
  );

  const avgCaloriesPerDay = Math.round(
    dailyData.reduce((sum, day) => sum + day.totalCalories, 0) /
      dailyData.length
  );

  return (
    <Card
      style={{ marginTop: 32 }}
      title={
        <Space>
          <CalendarOutlined />
          <span>Daily Calorie History ({dailyData.length} days)</span>
        </Space>
      }
    >
      {/* Stats Summary */}
      <Card size="small" style={{ background: "#fafafa", marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} md={6}>
            <Statistic
              title="Avg Calories/Day"
              value={formatNumber(avgCaloriesPerDay)}
              valueStyle={{ color: "#1677ff" }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Statistic
              title="Deficit Days"
              value={deficitDaysCount}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Statistic
              title="Total Deficit"
              value={formatNumber(getTotalDeficitAchieved())}
              prefix={<FireOutlined />}
              valueStyle={{ color: "#8b5cf6" }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Statistic
              title="Total Activities"
              value={totalActivities}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Col>
        </Row>
      </Card>

      {/* Daily History List */}
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {normalizeData(dailyData)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((day, index) => {
            const isToday = day.date === getTodayDate();
            const foodDeficit = calorieGoal?.maintenanceCalories
              ? calorieGoal.maintenanceCalories - day.totalCalories
              : 0;
            const exerciseBonus = day.totalCaloriesBurned || 0;
            const totalDayDeficit = foodDeficit + exerciseBonus;

            return (
              <Card
                key={day.date}
                size="small"
                style={{
                  marginBottom: 12,
                  background: isToday ? "#e6f4ff" : "#fafafa",
                  borderColor: isToday ? "#91caff" : "#d9d9d9",
                }}
              >
                {/* Date Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <Space>
                    <Text strong style={{ fontSize: "16px" }}>
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                    {isToday && <Tag color="blue">Today</Tag>}
                    {index === 1 && !isToday && (
                      <Tag color="default">Yesterday</Tag>
                    )}
                  </Space>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEditDay(day.date)}
                    style={{
                      borderColor: "#000000",
                      color: "#000000",
                      borderWidth: "2px",
                    }}
                  >
                    Edit
                  </Button>
                </div>

                {/* Stats Grid */}
                <Row gutter={[8, 8]}>
                  <Col xs={12} sm={6}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                        Consumed
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 600 }}>
                        {formatNumber(day.totalCalories)} cal
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                        Remaining
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color:
                            day.remainingCalories >= 0 ? "#52c41a" : "#ff4d4f",
                        }}
                      >
                        {formatNumber(day.remainingCalories)} cal
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                        <ThunderboltOutlined /> Burned
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#fa8c16",
                        }}
                      >
                        {formatNumber(day.totalCaloriesBurned || 0)} cal
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                        <FireOutlined /> Deficit
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: totalDayDeficit > 0 ? "#52c41a" : "#ff4d4f",
                        }}
                      >
                        {formatNumber(totalDayDeficit)} cal
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Activities Summary */}
                {(day.foodEntries.length > 0 ||
                  (day.exerciseEntries && day.exerciseEntries.length > 0)) && (
                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: "1px solid #e5e5e5",
                    }}
                  >
                    <Space size="small">
                      {day.foodEntries.length > 0 && (
                        <Tag
                          color="green"
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleDay(day.date)}
                          icon={
                            expandedDays.has(day.date) ? (
                              <UpOutlined />
                            ) : (
                              <DownOutlined />
                            )
                          }
                        >
                          🍎 {day.foodEntries.length} food
                          {day.foodEntries.length > 1 ? "s" : ""}
                        </Tag>
                      )}
                      {day.exerciseEntries &&
                        day.exerciseEntries.length > 0 && (
                          <Tag color="orange">
                            🏃 {day.exerciseEntries.length} exercise
                            {day.exerciseEntries.length > 1 ? "s" : ""}
                          </Tag>
                        )}
                    </Space>

                    {/* Expanded Food Details */}
                    {expandedDays.has(day.date) &&
                      day.foodEntries.length > 0 && (
                        <div
                          style={{
                            marginTop: 12,
                            padding: "12px",
                            background: "#fff",
                            borderRadius: "6px",
                            border: "1px solid #d9f7be",
                          }}
                        >
                          <Text
                            strong
                            style={{
                              fontSize: "13px",
                              color: "#52c41a",
                              display: "block",
                              marginBottom: "8px",
                            }}
                          >
                            Food Consumed:
                          </Text>
                          <Space
                            direction="vertical"
                            size="small"
                            style={{ width: "100%" }}
                          >
                            {day.foodEntries.map((food, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  padding: "6px 0",
                                  borderBottom:
                                    idx < day.foodEntries.length - 1
                                      ? "1px solid #f0f0f0"
                                      : "none",
                                }}
                              >
                                <Text style={{ fontSize: "14px", flex: 1 }}>
                                  {food.name}
                                </Text>
                                <Space size="small">
                                  <Tag color="green" style={{ margin: 0 }}>
                                    {formatNumber(food.calories)} cal
                                  </Tag>
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() =>
                                      handleEditFoodClick(food, day.date)
                                    }
                                    style={{ color: "#1890ff" }}
                                  />
                                </Space>
                              </div>
                            ))}
                          </Space>
                        </div>
                      )}
                  </div>
                )}
              </Card>
            );
          })}
      </div>

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
