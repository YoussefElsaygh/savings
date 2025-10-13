"use client";

import { useState } from "react";
import {
  DailyCalorieData,
  FoodEntry,
  ExerciseEntry,
  CalorieGoal,
} from "@/types";
import { formatNumber } from "@/lib/utils";
import AddFoodModal from "./AddFoodModal";
import AddExerciseModal from "./AddExerciseModal";
import {
  Modal,
  Button,
  Progress,
  Tag,
  Space,
  Typography,
  Card,
  Empty,
  Row,
  Col,
} from "antd";
import { SaveOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface EditDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: DailyCalorieData;
  calorieGoal: CalorieGoal | null;
  onUpdateDay: (updatedDay: DailyCalorieData) => void;
}

export default function EditDayModal({
  isOpen,
  onClose,
  dayData,
  calorieGoal,
  onUpdateDay,
}: EditDayModalProps) {
  const [currentDayData, setCurrentDayData] =
    useState<DailyCalorieData>(dayData);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);

  const handleAddFood = (foodData: {
    name: string;
    calories: number;
    description: string;
  }) => {
    const newFoodEntry: FoodEntry = {
      id: Date.now().toString(),
      name: foodData.name,
      calories: foodData.calories,
      timestamp: new Date().toISOString(),
      date: currentDayData.date,
    };

    const updatedDay = {
      ...currentDayData,
      foodEntries: [...currentDayData.foodEntries, newFoodEntry],
      totalCalories: currentDayData.totalCalories + foodData.calories,
    };

    updatedDay.remainingCalories =
      updatedDay.calorieLimit - updatedDay.totalCalories;
    setCurrentDayData(updatedDay);
  };

  const handleAddFoods = async (
    foodsData: Array<{
      name: string;
      calories: number;
      description: string;
    }>
  ) => {
    const newFoodEntries: FoodEntry[] = foodsData.map((foodData, index) => ({
      id: `${Date.now() + index}`,
      name: foodData.name,
      calories: foodData.calories,
      timestamp: new Date().toISOString(),
      date: currentDayData.date,
    }));

    const totalCaloriesFromFoods = foodsData.reduce(
      (sum, food) => sum + food.calories,
      0
    );

    const updatedDay = {
      ...currentDayData,
      foodEntries: [...currentDayData.foodEntries, ...newFoodEntries],
      totalCalories: currentDayData.totalCalories + totalCaloriesFromFoods,
    };

    updatedDay.remainingCalories =
      updatedDay.calorieLimit - updatedDay.totalCalories;
    setCurrentDayData(updatedDay);
  };

  const handleAddExercise = (exerciseData: {
    name: string;
    caloriesBurned: number;
    durationMinutes: number;
    description: string;
  }) => {
    const newExerciseEntry: ExerciseEntry = {
      id: Date.now().toString(),
      name: exerciseData.name,
      caloriesBurned: exerciseData.caloriesBurned,
      durationMinutes: exerciseData.durationMinutes,
      timestamp: new Date().toISOString(),
      date: currentDayData.date,
    };

    const updatedDay = {
      ...currentDayData,
      exerciseEntries: [
        ...(currentDayData.exerciseEntries || []),
        newExerciseEntry,
      ],
      totalCaloriesBurned:
        (currentDayData.totalCaloriesBurned || 0) + exerciseData.caloriesBurned,
    };

    setCurrentDayData(updatedDay);
  };

  const handleAddExercises = async (
    exercisesData: Array<{
      name: string;
      caloriesBurned: number;
      durationMinutes: number;
      description: string;
    }>
  ) => {
    const newExerciseEntries: ExerciseEntry[] = exercisesData.map(
      (exerciseData, index) => ({
        id: `${Date.now() + index}`,
        name: exerciseData.name,
        caloriesBurned: exerciseData.caloriesBurned,
        durationMinutes: exerciseData.durationMinutes,
        timestamp: new Date().toISOString(),
        date: currentDayData.date,
      })
    );

    const totalCaloriesBurned = exercisesData.reduce(
      (sum, ex) => sum + ex.caloriesBurned,
      0
    );

    const updatedDay = {
      ...currentDayData,
      exerciseEntries: [
        ...(currentDayData.exerciseEntries || []),
        ...newExerciseEntries,
      ],
      totalCaloriesBurned:
        (currentDayData.totalCaloriesBurned || 0) + totalCaloriesBurned,
    };

    setCurrentDayData(updatedDay);
  };

  const handleDeleteFood = (foodId: string) => {
    const foodToDelete = currentDayData.foodEntries.find(
      (f) => f.id === foodId
    );
    if (foodToDelete) {
      const updatedDay = {
        ...currentDayData,
        foodEntries: currentDayData.foodEntries.filter((f) => f.id !== foodId),
        totalCalories: currentDayData.totalCalories - foodToDelete.calories,
      };
      updatedDay.remainingCalories =
        updatedDay.calorieLimit - updatedDay.totalCalories;
      setCurrentDayData(updatedDay);
    }
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const exerciseToDelete = currentDayData.exerciseEntries?.find(
      (e) => e.id === exerciseId
    );
    if (exerciseToDelete) {
      const updatedDay = {
        ...currentDayData,
        exerciseEntries: (currentDayData.exerciseEntries || []).filter(
          (e) => e.id !== exerciseId
        ),
        totalCaloriesBurned:
          (currentDayData.totalCaloriesBurned || 0) -
          exerciseToDelete.caloriesBurned,
      };
      setCurrentDayData(updatedDay);
    }
  };

  const handleSave = () => {
    onUpdateDay(currentDayData);
    onClose();
  };

  const handleCancel = () => {
    setCurrentDayData(dayData);
    onClose();
  };

  const foodDeficit = calorieGoal?.maintenanceCalories
    ? calorieGoal.maintenanceCalories - currentDayData.totalCalories
    : 0;
  const exerciseBonus = currentDayData.totalCaloriesBurned || 0;
  const totalDayDeficit = foodDeficit + exerciseBonus;

  const progressPercent =
    (currentDayData.totalCalories / currentDayData.calorieLimit) * 100;

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={handleCancel}
        title={`📝 Edit Day - ${new Date(
          currentDayData.date
        ).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`}
        width="100%"
        style={{
          top: 0,
          maxWidth: 900,
          margin: "0 auto",
          paddingBottom: 0,
          height: "100vh",
        }}
        styles={{
          body: {
            height: "calc(100vh - 55px - 53px)",
            overflowY: "auto",
            padding: "12px",
          },
          content: {
            borderRadius: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
        footer={[
          <Button key="cancel" onClick={handleCancel} size="large">
            Cancel
          </Button>,
          <Button
            key="save"
            onClick={handleSave}
            icon={<SaveOutlined />}
            size="large"
            style={{
              borderColor: "#52c41a",
              color: "#52c41a",
              borderWidth: "2px",
            }}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Stats Header */}
          <Space wrap>
            <Text type="secondary">
              🍽️ {formatNumber(currentDayData.totalCalories)} cal consumed
            </Text>
            <Text type="secondary">
              🔥 {formatNumber(currentDayData.totalCaloriesBurned || 0)} cal
              burned
            </Text>
            <Tag color={totalDayDeficit > 0 ? "success" : "error"}>
              {formatNumber(totalDayDeficit)}{" "}
              {totalDayDeficit > 0 ? "deficit" : "surplus"}
            </Tag>
          </Space>

          {/* Progress Bar */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text type="secondary">
                vs Target ({formatNumber(currentDayData.calorieLimit)} cal)
              </Text>
              <Text strong>{progressPercent.toFixed(0)}%</Text>
            </div>
            <Progress
              percent={Math.min(progressPercent, 100)}
              strokeColor={
                currentDayData.totalCalories <= currentDayData.calorieLimit
                  ? "#52c41a"
                  : "#ff4d4f"
              }
              showInfo={false}
            />
          </div>

          <Row gutter={[16, 16]}>
            {/* Food Entries */}
            <Col xs={24} md={12}>
              <Card
                size="small"
                title={`🍎 Food Entries (${currentDayData.foodEntries.length})`}
                extra={
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddFoodModal(true)}
                    style={{
                      borderColor: "#52c41a",
                      color: "#52c41a",
                      borderWidth: "2px",
                    }}
                  >
                    Add Food
                  </Button>
                }
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                >
                  {currentDayData.foodEntries.length > 0 ? (
                    currentDayData.foodEntries
                      .sort(
                        (a, b) =>
                          new Date(a.timestamp).getTime() -
                          new Date(b.timestamp).getTime()
                      )
                      .map((entry) => (
                        <Card
                          key={entry.id}
                          size="small"
                          style={{
                            background: "#f6ffed",
                            borderColor: "#b7eb8f",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <Text strong>{entry.name}</Text>
                              <br />
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                {new Date(entry.timestamp).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </Text>
                            </div>
                            <Space>
                              <Text strong>
                                {formatNumber(entry.calories)} cal
                              </Text>
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteFood(entry.id)}
                              />
                            </Space>
                          </div>
                        </Card>
                      ))
                  ) : (
                    <Empty
                      image={<div style={{ fontSize: "48px" }}>🍽️</div>}
                      description="No food entries yet"
                      imageStyle={{ height: "auto" }}
                    />
                  )}
                </Space>
              </Card>
            </Col>

            {/* Exercise Entries */}
            <Col xs={24} md={12}>
              <Card
                size="small"
                title={`🏃 Exercise Entries (${
                  (currentDayData.exerciseEntries || []).length
                })`}
                extra={
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddExerciseModal(true)}
                    style={{
                      borderColor: "#fa8c16",
                      color: "#fa8c16",
                      borderWidth: "2px",
                    }}
                  >
                    Add Exercise
                  </Button>
                }
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                >
                  {(currentDayData.exerciseEntries || []).length > 0 ? (
                    (currentDayData.exerciseEntries || [])
                      .sort(
                        (a, b) =>
                          new Date(a.timestamp).getTime() -
                          new Date(b.timestamp).getTime()
                      )
                      .map((entry) => (
                        <Card
                          key={entry.id}
                          size="small"
                          style={{
                            background: "#fff7e6",
                            borderColor: "#ffd591",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <Text strong>{entry.name}</Text>
                              <br />
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                {entry.durationMinutes} min •{" "}
                                {new Date(entry.timestamp).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </Text>
                            </div>
                            <Space>
                              <Text strong style={{ color: "#fa8c16" }}>
                                -{formatNumber(entry.caloriesBurned)} cal
                              </Text>
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteExercise(entry.id)}
                              />
                            </Space>
                          </div>
                        </Card>
                      ))
                  ) : (
                    <Empty
                      image={<div style={{ fontSize: "48px" }}>🏃</div>}
                      description="No exercise entries yet"
                      imageStyle={{ height: "auto" }}
                    />
                  )}
                </Space>
              </Card>
            </Col>
          </Row>
        </Space>
      </Modal>

      {/* Add Food Modal */}
      <AddFoodModal
        isOpen={showAddFoodModal}
        onClose={() => setShowAddFoodModal(false)}
        onAddFood={handleAddFood}
        onAddFoods={handleAddFoods}
      />

      {/* Add Exercise Modal */}
      <AddExerciseModal
        isOpen={showAddExerciseModal}
        onClose={() => setShowAddExerciseModal(false)}
        onAddExercise={handleAddExercise}
        onAddExercises={handleAddExercises}
      />
    </>
  );
}
