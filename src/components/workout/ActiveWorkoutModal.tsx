"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Card,
  Button,
  InputNumber,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Statistic,
  Checkbox,
  message,
  Tag,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  TrophyOutlined,
  FireOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  WorkoutPlan,
  WorkoutSession,
  WorkoutExercise,
  WorkoutSet,
  PersonalRecord,
  Exercise,
} from "@/types";
import { getExerciseById } from "@/constants/exercises-library";
import ModalContainer from "@/components/shared/ModalContainer";
import LazyExerciseGif from "./LazyExerciseGif";
import ExerciseAlternativesModal from "./ExerciseAlternativesModal";

const { Title, Text } = Typography;

interface ActiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: WorkoutPlan;
  onSaveWorkout: (session: WorkoutSession) => Promise<void>;
  existingPRs: PersonalRecord[];
}

export default function ActiveWorkoutModal({
  isOpen,
  onClose,
  plan,
  onSaveWorkout,
  existingPRs,
}: ActiveWorkoutModalProps) {
  const [startTime] = useState(new Date().toISOString());
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [newPRs, setNewPRs] = useState<PersonalRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [alternativesModalOpen, setAlternativesModalOpen] = useState(false);

  // Initialize exercises with empty sets when modal opens
  useEffect(() => {
    if (isOpen && plan) {
      const initializedExercises = plan.exercises.map((ex) => ({
        ...ex,
        sets: Array.from({ length: ex.targetSets }, (_, i) => ({
          id: `${ex.exerciseId}-set-${i + 1}`,
          reps: ex.targetReps,
          weight: 0,
          completed: false,
        })),
      }));
      setExercises(initializedExercises);
      setCurrentExerciseIndex(0);
      setNewPRs([]);
    }
  }, [isOpen, plan]);

  const currentExercise = exercises[currentExerciseIndex];
  const exerciseDetails = currentExercise
    ? getExerciseById(currentExercise.exerciseId)
    : null;

  // Check if set is a new PR
  const checkForPR = (
    exerciseId: string,
    weight: number,
    reps: number
  ): boolean => {
    const existingPR = existingPRs.find((pr) => pr.exerciseId === exerciseId);
    if (!existingPR) return weight > 0; // First time is always a PR

    // Check if weight is higher, or same weight with more reps
    return (
      weight > existingPR.weight ||
      (weight === existingPR.weight && reps > existingPR.reps)
    );
  };

  const handleSetUpdate = (
    setIndex: number,
    field: "reps" | "weight",
    value: number
  ) => {
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].sets[setIndex][field] = value;
    setExercises(updatedExercises);
  };

  const handleToggleSet = (setIndex: number) => {
    const updatedExercises = [...exercises];
    const set = updatedExercises[currentExerciseIndex].sets[setIndex];
    set.completed = !set.completed;

    // Check for PR when completing a set
    if (set.completed && set.weight > 0) {
      const isPR = checkForPR(currentExercise.exerciseId, set.weight, set.reps);
      if (isPR) {
        const newPR: PersonalRecord = {
          exerciseId: currentExercise.exerciseId,
          exerciseName: currentExercise.exerciseName,
          weight: set.weight,
          reps: set.reps,
          date: new Intl.DateTimeFormat("en-CA").format(new Date()),
          timestamp: new Date().toISOString(),
        };
        setNewPRs([...newPRs, newPR]);
        message.success(
          `🎉 New PR! ${currentExercise.exerciseName}: ${set.weight}kg x ${set.reps}`
        );
      }
    }

    setExercises(updatedExercises);
  };

  const handleAddSet = () => {
    const updatedExercises = [...exercises];
    const newSet: WorkoutSet = {
      id: `${currentExercise.exerciseId}-set-${
        currentExercise.sets.length + 1
      }`,
      reps: currentExercise.targetReps,
      weight: 0,
      completed: false,
    };
    updatedExercises[currentExerciseIndex].sets.push(newSet);
    updatedExercises[currentExerciseIndex].targetSets += 1;
    setExercises(updatedExercises);
  };

  const handleDeleteSet = (setIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].sets.splice(setIndex, 1);
    updatedExercises[currentExerciseIndex].targetSets -= 1;
    setExercises(updatedExercises);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const calculateTotalVolume = (): number => {
    return exercises.reduce((total, exercise) => {
      const exerciseVolume = exercise.sets
        .filter((set) => set.completed)
        .reduce((sum, set) => sum + set.weight * set.reps, 0);
      return total + exerciseVolume;
    }, 0);
  };

  const handleSwapExercise = (newExercise: Exercise) => {
    const updatedExercises = [...exercises];
    const currentEx = updatedExercises[currentExerciseIndex];

    // Keep the same sets structure but update exercise details
    updatedExercises[currentExerciseIndex] = {
      ...currentEx,
      exerciseId: newExercise.id,
      exerciseName: newExercise.name,
      // Reset sets to maintain consistency
      sets: currentEx.sets.map((set) => ({
        ...set,
        completed: false,
        weight: 0,
      })),
    };

    setExercises(updatedExercises);
    message.success(`Swapped to ${newExercise.name}`);
  };

  const handleFinishWorkout = async () => {
    setSaving(true);
    try {
      const completedSets = exercises.reduce(
        (count, ex) => count + ex.sets.filter((s) => s.completed).length,
        0
      );

      if (completedSets === 0) {
        message.warning("Complete at least one set before finishing!");
        setSaving(false);
        return;
      }

      const session: WorkoutSession = {
        id: Date.now().toString(),
        planId: plan.id,
        planName: plan.name,
        date: new Intl.DateTimeFormat("en-CA").format(new Date()),
        startTime,
        endTime: new Date().toISOString(),
        exercises,
        totalVolume: calculateTotalVolume(),
        duration: Math.round(
          (Date.now() - new Date(startTime).getTime()) / 60000
        ),
        completed: true,
      };

      await onSaveWorkout(session);
      message.success(
        `💪 Workout completed! Total volume: ${session.totalVolume}kg`
      );
      onClose();
    } catch (error) {
      message.error("Failed to save workout");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!currentExercise || !exerciseDetails) return null;

  const completedSets = currentExercise.sets.filter((s) => s.completed).length;
  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;

  return (
    <ModalContainer
      title={
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: "18px" }}>
            {plan.dayName}
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </Text>
        </Space>
      }
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={900}
      heightMode="full"
      footer={[
        <Button
          key="previous"
          onClick={previousExercise}
          disabled={currentExerciseIndex === 0}
        >
          Previous
        </Button>,
        <Button
          key="next"
          type="primary"
          onClick={nextExercise}
          disabled={currentExerciseIndex === exercises.length - 1}
        >
          Next Exercise
        </Button>,
        <Button
          key="finish"
          type="primary"
          danger
          onClick={handleFinishWorkout}
          loading={saving}
          icon={<CheckOutlined />}
        >
          Finish Workout
        </Button>,
      ]}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Progress Bar */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <Text strong>Overall Progress</Text>
            <Text>{Math.round(progress)}%</Text>
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#52c41a",
                borderRadius: "4px",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        {/* Current Exercise */}
        <Card>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <Title level={3} style={{ margin: 0 }}>
                  {exerciseDetails.name}
                </Title>
                {exerciseDetails.alternatives &&
                  exerciseDetails.alternatives.length > 0 && (
                    <Button
                      type="default"
                      icon={<SwapOutlined />}
                      onClick={() => setAlternativesModalOpen(true)}
                      size="small"
                    >
                      Swap ({exerciseDetails.alternatives.length})
                    </Button>
                  )}
              </div>
              <Space size="small">
                <Tag color="blue">{exerciseDetails.muscleGroup}</Tag>
                {exerciseDetails.equipment.map((eq) => (
                  <Tag key={eq}>{eq}</Tag>
                ))}
              </Space>
              <Text
                type="secondary"
                style={{ display: "block", marginTop: "12px" }}
              >
                {exerciseDetails.description}
              </Text>

              <div style={{ marginTop: "16px" }}>
                <Text strong>Tips:</Text>
                <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                  {exerciseDetails.tips.map((tip, i) => (
                    <li key={i}>
                      <Text type="secondary">{tip}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            <Col xs={24} md={12}>
              {exerciseDetails.gifUrl && (
                <LazyExerciseGif
                  src={exerciseDetails.gifUrl}
                  alt={exerciseDetails.name}
                />
              )}
            </Col>
          </Row>
        </Card>

        {/* Sets Table */}
        <Card
          title={`Sets (${completedSets}/${currentExercise.sets.length} completed)`}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {currentExercise.sets.map((set, index) => (
              <Card
                key={set.id}
                size="small"
                style={{
                  background: set.completed ? "#f6ffed" : "#fff",
                  borderColor: set.completed ? "#b7eb8f" : "#d9d9d9",
                }}
              >
                <Row gutter={16} align="middle">
                  <Col span={2}>
                    <Text strong>#{index + 1}</Text>
                  </Col>
                  <Col span={7}>
                    <Space direction="vertical" size={0}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Weight (kg)
                      </Text>
                      <InputNumber
                        value={set.weight}
                        onChange={(val) =>
                          handleSetUpdate(index, "weight", val || 0)
                        }
                        min={0}
                        step={2.5}
                        style={{ width: "100%" }}
                        disabled={set.completed}
                      />
                    </Space>
                  </Col>
                  <Col span={7}>
                    <Space direction="vertical" size={0}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Reps
                      </Text>
                      <InputNumber
                        value={set.reps}
                        onChange={(val) =>
                          handleSetUpdate(index, "reps", val || 0)
                        }
                        min={0}
                        style={{ width: "100%" }}
                        disabled={set.completed}
                      />
                    </Space>
                  </Col>
                  <Col span={6}>
                    <Button
                      type={set.completed ? "default" : "primary"}
                      icon={set.completed ? <CheckOutlined /> : undefined}
                      onClick={() => handleToggleSet(index)}
                      block
                    >
                      {set.completed ? "Done" : "Complete"}
                    </Button>
                  </Col>
                  <Col span={2}>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteSet(index)}
                      disabled={currentExercise.sets.length === 1}
                    />
                  </Col>
                </Row>
              </Card>
            ))}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddSet}
              block
            >
              Add Set
            </Button>
          </Space>
        </Card>

        {/* Stats */}
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Statistic
                title="Total Volume (this exercise)"
                value={currentExercise.sets
                  .filter((s) => s.completed)
                  .reduce((sum, s) => sum + s.weight * s.reps, 0)}
                suffix="kg"
                prefix={<FireOutlined />}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="New PRs"
                value={newPRs.length}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
        </Row>
      </Space>

      {/* Exercise Alternatives Modal */}
      {exerciseDetails && (
        <ExerciseAlternativesModal
          open={alternativesModalOpen}
          onClose={() => setAlternativesModalOpen(false)}
          currentExercise={exerciseDetails}
          onSwap={handleSwapExercise}
        />
      )}
    </ModalContainer>
  );
}
