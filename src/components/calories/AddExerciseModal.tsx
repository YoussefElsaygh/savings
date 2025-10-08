"use client";

import { useState, useEffect } from "react";
import {
  EXERCISE_CATEGORIES,
  getExercisesByCategory,
  calculateCaloriesBurned,
  COMMON_DURATIONS,
  type ExerciseConstant,
} from "@/constants/exercises";
import {
  Modal,
  Button,
  Input,
  InputNumber,
  Tabs,
  Card,
  Row,
  Col,
  Tag,
  Space,
} from "antd";
import { PlusOutlined, ThunderboltOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercise: (exercise: {
    name: string;
    caloriesBurned: number;
    durationMinutes: number;
    description: string;
  }) => void;
}

export default function AddExerciseModal({
  isOpen,
  onClose,
  onAddExercise,
}: AddExerciseModalProps) {
  // Exercise entry states
  const [exerciseEntryMode, setExerciseEntryMode] = useState<
    "preset" | "custom"
  >("preset");
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseConstant | null>(null);
  const [duration, setDuration] = useState("");
  const [customExerciseName, setCustomExerciseName] = useState("");
  const [customCaloriesBurned, setCustomCaloriesBurned] = useState("");
  const [calculatedCaloriesBurned, setCalculatedCaloriesBurned] = useState(0);

  const exercisesByCategory = getExercisesByCategory();

  // Calculate calories burned when preset exercise selection changes
  useEffect(() => {
    if (exerciseEntryMode === "preset" && selectedExercise && duration) {
      const durationNum = parseFloat(duration);
      if (durationNum > 0) {
        const caloriesBurned = calculateCaloriesBurned(
          selectedExercise,
          durationNum
        );
        setCalculatedCaloriesBurned(Math.round(caloriesBurned));
      } else {
        setCalculatedCaloriesBurned(0);
      }
    } else {
      setCalculatedCaloriesBurned(0);
    }
  }, [selectedExercise, duration, exerciseEntryMode]);

  const handleAddExercise = () => {
    let caloriesBurned: number;
    let name: string;
    let durationMins: number;
    let description: string;

    if (exerciseEntryMode === "preset" && selectedExercise && duration) {
      const durationNum = parseFloat(duration);
      if (durationNum > 0) {
        caloriesBurned = calculateCaloriesBurned(selectedExercise, durationNum);
        name = selectedExercise.name;
        durationMins = durationNum;
        description = `${durationNum} min`;
      } else {
        return;
      }
    } else if (exerciseEntryMode === "custom") {
      const customBurned = parseFloat(customCaloriesBurned);
      const customName = customExerciseName.trim();
      const durationNum = parseFloat(duration);
      if (!customName || customBurned <= 0 || durationNum <= 0) {
        return;
      }
      caloriesBurned = customBurned;
      name = customName;
      durationMins = durationNum;
      description = "custom entry";
    } else {
      return;
    }

    if (caloriesBurned > 0) {
      onAddExercise({
        name: `${name} (${description})`,
        caloriesBurned: Math.round(caloriesBurned),
        durationMinutes: durationMins,
        description,
      });

      // Reset form and close modal
      resetExerciseForm();
      onClose();
    }
  };

  const resetExerciseForm = () => {
    setDuration("");
    setCustomExerciseName("");
    setCustomCaloriesBurned("");
    setSelectedExercise(null);
    setCalculatedCaloriesBurned(0);
  };

  const handleClose = () => {
    resetExerciseForm();
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      title="🏃 Add Exercise"
      width={1100}
      style={{ top: 20 }}
      footer={[
        <Button key="cancel" onClick={handleClose} size="large">
          Cancel
        </Button>,
        <Button
          key="submit"
          onClick={handleAddExercise}
          icon={<PlusOutlined />}
          size="large"
          disabled={
            (exerciseEntryMode === "preset" &&
              (!selectedExercise || !duration || parseFloat(duration) <= 0)) ||
            (exerciseEntryMode === "custom" &&
              (!customExerciseName.trim() ||
                !customCaloriesBurned ||
                parseFloat(customCaloriesBurned) <= 0 ||
                !duration ||
                parseFloat(duration) <= 0))
          }
          style={{
            borderColor: "#fa8c16",
            color: "#fa8c16",
            borderWidth: "2px",
          }}
        >
          Add Exercise
        </Button>,
      ]}
    >
      <Tabs
        activeKey={exerciseEntryMode}
        onChange={(key) => {
          setExerciseEntryMode(key as "preset" | "custom");
          if (key === "custom") {
            setSelectedExercise(null);
            setDuration("");
            setCalculatedCaloriesBurned(0);
          }
        }}
        size="large"
      >
        <TabPane tab="🏃 Preset Exercises" key="preset">
          {exerciseEntryMode === "preset" && (
            <div>
              {selectedExercise && (
                <Card
                  size="small"
                  title={`Selected: ${selectedExercise.name}`}
                  style={{ marginBottom: 16, background: "#fff7e6" }}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          fontWeight: 500,
                        }}
                      >
                        Duration (minutes)
                      </label>
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="e.g. 30"
                        value={duration ? parseFloat(duration) : null}
                        onChange={(val) => setDuration(val?.toString() || "")}
                        min={0}
                        step={1}
                        size="large"
                      />
                    </Col>
                    <Col span={8}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          fontWeight: 500,
                        }}
                      >
                        Quick Select
                      </label>
                      <Space wrap>
                        {COMMON_DURATIONS.map((dur) => (
                          <Tag
                            key={dur.value}
                            onClick={() => setDuration(dur.value.toString())}
                            style={{
                              cursor: "pointer",
                              padding: "4px 12px",
                              background:
                                duration === dur.value.toString()
                                  ? "#fa8c16"
                                  : "#fff",
                              color:
                                duration === dur.value.toString()
                                  ? "#fff"
                                  : "#000",
                              border:
                                duration === dur.value.toString()
                                  ? "1px solid #fa8c16"
                                  : "1px solid #d9d9d9",
                            }}
                          >
                            {dur.label}
                          </Tag>
                        ))}
                      </Space>
                    </Col>
                    <Col span={8}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          fontWeight: 500,
                        }}
                      >
                        Calories Burned
                      </label>
                      <div
                        style={{
                          padding: "8px 12px",
                          background: "#fa8c16",
                          color: "white",
                          borderRadius: "8px",
                          fontSize: "16px",
                          fontWeight: 600,
                          textAlign: "center",
                          height: "40px",
                          lineHeight: "24px",
                        }}
                      >
                        <ThunderboltOutlined /> {calculatedCaloriesBurned} cal
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {Object.entries(exercisesByCategory).map(
                  ([category, exercises]) => {
                    const categoryColors: Record<
                      string,
                      { bg: string; border: string }
                    > = {
                      cardio: { bg: "#fff1f0", border: "#ffa39e" },
                      strength: { bg: "#e6f4ff", border: "#91caff" },
                      flexibility: { bg: "#f6ffed", border: "#b7eb8f" },
                      sports: { bg: "#fff7e6", border: "#ffd591" },
                      daily: { bg: "#f9f0ff", border: "#d3adf7" },
                    };

                    const colors = categoryColors[category] || {
                      bg: "#fafafa",
                      border: "#d9d9d9",
                    };

                    return (
                      <Card
                        key={category}
                        size="small"
                        title={
                          EXERCISE_CATEGORIES[
                            category as keyof typeof EXERCISE_CATEGORIES
                          ].name
                        }
                        style={{
                          marginBottom: 16,
                          background: colors.bg,
                          borderColor: colors.border,
                          borderWidth: 2,
                        }}
                      >
                        <Row gutter={[8, 8]}>
                          {exercises.map((exercise) => (
                            <Col key={exercise.id} xs={12} sm={8} md={6}>
                              <Card
                                size="small"
                                hoverable
                                onClick={() => setSelectedExercise(exercise)}
                                style={{
                                  background:
                                    selectedExercise?.id === exercise.id
                                      ? "#ffe7ba"
                                      : "#fff",
                                  borderColor:
                                    selectedExercise?.id === exercise.id
                                      ? "#fa8c16"
                                      : "#d9d9d9",
                                  borderWidth:
                                    selectedExercise?.id === exercise.id
                                      ? 2
                                      : 1,
                                }}
                              >
                                <div
                                  style={{ fontSize: "13px", fontWeight: 500 }}
                                >
                                  {exercise.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#8c8c8c",
                                    marginTop: 4,
                                  }}
                                >
                                  {exercise.caloriesPerHour} cal/hr
                                </div>
                                <div
                                  style={{
                                    fontSize: "10px",
                                    color: "#aaa",
                                    marginTop: 2,
                                  }}
                                >
                                  {exercise.intensityLevel}
                                </div>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Card>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </TabPane>
        <TabPane tab="✏️ Custom Entry" key="custom">
          {exerciseEntryMode === "custom" && (
            <Row gutter={16}>
              <Col span={12}>
                <label
                  style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
                >
                  Exercise Name
                </label>
                <Input
                  placeholder="e.g. Basketball, Dancing"
                  value={customExerciseName}
                  onChange={(e) => setCustomExerciseName(e.target.value)}
                  size="large"
                />
              </Col>
              <Col span={6}>
                <label
                  style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
                >
                  Duration (min)
                </label>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="e.g. 30"
                  value={duration ? parseFloat(duration) : null}
                  onChange={(val) => setDuration(val?.toString() || "")}
                  min={0}
                  step={1}
                  size="large"
                />
              </Col>
              <Col span={6}>
                <label
                  style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
                >
                  Calories Burned
                </label>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="e.g. 150"
                  value={
                    customCaloriesBurned
                      ? parseFloat(customCaloriesBurned)
                      : null
                  }
                  onChange={(val) =>
                    setCustomCaloriesBurned(val?.toString() || "")
                  }
                  min={0}
                  step={1}
                  size="large"
                />
              </Col>
            </Row>
          )}
        </TabPane>
      </Tabs>
    </Modal>
  );
}
