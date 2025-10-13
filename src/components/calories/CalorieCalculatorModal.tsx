"use client";

import { useState, useEffect } from "react";
import {
  InputNumber,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Divider,
  Alert,
} from "antd";
import {
  CalculatorOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { formatNumber } from "@/lib/utils";
import { CalorieGoal } from "@/types";
import ModalContainer from "@/components/shared/ModalContainer";

const { Text, Title } = Typography;
const { Option } = Select;

interface CalorieCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal?: (goal: CalorieGoal) => void;
  existingGoal?: CalorieGoal | null;
}

type Gender = "male" | "female";
type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
type Goal = "lose" | "maintain" | "gain";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2, // Little or no exercise
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  active: 1.725, // Hard exercise 6-7 days/week
  very_active: 1.9, // Very hard exercise & physical job
};

const activityLabels: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (little or no exercise)",
  light: "Lightly Active (1-3 days/week)",
  moderate: "Moderately Active (3-5 days/week)",
  active: "Very Active (6-7 days/week)",
  very_active: "Extra Active (very hard exercise & physical job)",
};

export default function CalorieCalculatorModal({
  isOpen,
  onClose,
  onSaveGoal,
  existingGoal,
}: CalorieCalculatorModalProps) {
  // Input states
  const [age, setAge] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null); // kg
  const [height, setHeight] = useState<number | null>(null); // cm
  const [gender, setGender] = useState<Gender>("male");
  const [bodyFat, setBodyFat] = useState<number | null>(null); // percentage
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("lose");
  const [targetWeightChange, setTargetWeightChange] = useState<number | null>(
    5
  ); // kg
  const [targetWeeks, setTargetWeeks] = useState<number | null>(10); // weeks to reach goal

  // Populate fields from existing goal when modal opens
  useEffect(() => {
    if (isOpen && existingGoal) {
      setAge(existingGoal.age ?? null);
      setWeight(existingGoal.weight ?? null);
      setHeight(existingGoal.height ?? null);
      setGender(existingGoal.gender ?? "male");
      setBodyFat(existingGoal.bodyFat ?? null);
      setActivityLevel(existingGoal.activityLevel ?? "moderate");
      setGoal(existingGoal.goal ?? "lose");
      setTargetWeightChange(existingGoal.targetWeightChange ?? 5);
      setTargetWeeks(existingGoal.targetWeeks ?? 10);
    }
  }, [isOpen, existingGoal]);

  // Calculate BMR (Basal Metabolic Rate)
  const calculateBMR = (): number | null => {
    if (!weight || !height || !age) return null;

    // If body fat % is provided, use Katch-McArdle Formula (more accurate)
    if (bodyFat !== null && bodyFat > 0 && bodyFat < 100) {
      const leanBodyMass = weight * (1 - bodyFat / 100);
      return 370 + 21.6 * leanBodyMass;
    }

    // Otherwise use Mifflin-St Jeor Equation
    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  // Calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = (): number | null => {
    const bmr = calculateBMR();
    if (!bmr) return null;
    return bmr * activityMultipliers[activityLevel];
  };

  // Calculate target calories based on goal and target weeks
  const calculateTargetCalories = (): {
    maintenance: number;
    target: number;
    dailyDeficit: number;
  } | null => {
    const tdee = calculateTDEE();
    if (!tdee) return null;

    const maintenance = Math.round(tdee);
    let target: number;
    let dailyDeficit: number;

    if (goal === "lose" || goal === "gain") {
      // Calculate required daily deficit/surplus based on target weeks
      const totalCalories = calculateTotalCalories();
      const totalDays = (targetWeeks || 10) * 7;

      if (goal === "lose") {
        // Daily deficit needed to lose target weight in target weeks
        dailyDeficit = Math.round(totalCalories / totalDays);
        target = maintenance - dailyDeficit;
      } else {
        // Daily surplus needed to gain target weight in target weeks
        dailyDeficit = -Math.round(totalCalories / totalDays); // negative = surplus
        target = maintenance - dailyDeficit;
      }
    } else {
      // Maintain
      dailyDeficit = 0;
      target = maintenance;
    }

    return {
      maintenance,
      target: Math.round(target),
      dailyDeficit,
    };
  };

  // Calculate total calories needed for goal
  const calculateTotalCalories = (): number => {
    // 1 kg of body fat = approximately 7700 calories
    return Math.abs(targetWeightChange || 0) * 7700;
  };

  // Calculate recommended safe deficit/surplus range
  const calculateSafeRange = (): { min: number; max: number } | null => {
    if (goal === "lose") {
      // Safe weight loss: 0.5 to 1 kg per week
      // 0.5 kg/week = 3850 cal/week = 550 cal/day
      // 1 kg/week = 7700 cal/week = 1100 cal/day
      return { min: 500, max: 1000 };
    } else if (goal === "gain") {
      // Safe weight gain: 0.25 to 0.5 kg per week
      // 0.25 kg/week = 1925 cal/week = 275 cal/day
      // 0.5 kg/week = 3850 cal/week = 550 cal/day
      return { min: 250, max: 500 };
    }
    return null;
  };

  const bmr = calculateBMR();
  const tdee = calculateTDEE();
  const targetCalories = calculateTargetCalories();
  const totalCalories = calculateTotalCalories();
  const safeRange = calculateSafeRange();

  const canCalculate = age && weight && height;

  // Check if daily deficit is within safe range
  const isDeficitSafe = (): boolean => {
    if (!targetCalories || !safeRange) return true;
    const deficit = Math.abs(targetCalories.dailyDeficit);
    return deficit >= safeRange.min && deficit <= safeRange.max;
  };

  const handleSaveToGoal = () => {
    if (!targetCalories || !onSaveGoal) return;

    // Calculate kg per week for targetWeightLoss
    const validWeightChange = targetWeightChange || 0;
    const validWeeks = targetWeeks || 10;
    const kgPerWeek =
      goal === "lose" || goal === "gain" ? validWeightChange / validWeeks : 0;

    const newGoal: CalorieGoal = {
      maintenanceCalories: targetCalories.maintenance,
      dailyCalorieLimit: targetCalories.target,
      targetWeightLoss: kgPerWeek, // kg per week, not total
      totalCaloriesToLose: goal === "lose" ? totalCalories : 0,
      createdAt: existingGoal?.createdAt || new Date().toISOString(),
      // Save personal data
      age: age ?? undefined,
      weight: weight ?? undefined,
      height: height ?? undefined,
      gender,
      bodyFat: bodyFat ?? undefined,
      activityLevel,
      goal,
      targetWeightChange: validWeightChange,
      targetWeeks: validWeeks,
    };

    onSaveGoal(newGoal);
    onClose();
  };

  return (
    <ModalContainer
      title={
        <Space>
          <CalculatorOutlined style={{ fontSize: "20px" }} />
          <span>Calorie Calculator</span>
        </Space>
      }
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={800}
      showFooter={!!(canCalculate && targetCalories && onSaveGoal)}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Close
        </Button>,
        <Button key="save" type="primary" onClick={handleSaveToGoal}>
          Save as My Goal
        </Button>,
      ]}
      heightMode="full"
      compactPadding={true}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Personal Information */}
        <Card
          title="Personal Information"
          size="small"
          style={{ backgroundColor: "#fafafa" }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Age (years)
                </Text>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="e.g. 30"
                  value={age}
                  onChange={setAge}
                  min={15}
                  max={100}
                  size="large"
                />
              </Col>
              <Col span={12}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Gender
                </Text>
                <Select
                  style={{ width: "100%" }}
                  value={gender}
                  onChange={setGender}
                  size="large"
                >
                  <Option value="male">
                    <ManOutlined /> Male
                  </Option>
                  <Option value="female">
                    <WomanOutlined /> Female
                  </Option>
                </Select>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Weight (kg)
                </Text>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="e.g. 80"
                  value={weight}
                  onChange={setWeight}
                  min={30}
                  max={300}
                  step={0.1}
                  size="large"
                />
              </Col>
              <Col span={12}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Height (cm)
                </Text>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="e.g. 175"
                  value={height}
                  onChange={setHeight}
                  min={100}
                  max={250}
                  step={1}
                  size="large"
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Body Fat % (Optional - for more accurate calculation)
                </Text>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="e.g. 20"
                  value={bodyFat}
                  onChange={setBodyFat}
                  min={5}
                  max={50}
                  step={0.1}
                  size="large"
                />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  If provided, Katch-McArdle formula will be used (more
                  accurate)
                </Text>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* Activity Level */}
        <Card
          title="Activity Level"
          size="small"
          style={{ backgroundColor: "#fafafa" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              Select your typical activity level
            </Text>
            <Select
              style={{ width: "100%" }}
              value={activityLevel}
              onChange={setActivityLevel}
              size="large"
            >
              {(Object.keys(activityMultipliers) as ActivityLevel[]).map(
                (level) => (
                  <Option key={level} value={level}>
                    {activityLabels[level]} (×{activityMultipliers[level]})
                  </Option>
                )
              )}
            </Select>
          </Space>
        </Card>

        {/* Goal Setting */}
        <Card
          title="Your Goal"
          size="small"
          style={{ backgroundColor: "#fafafa" }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Row gutter={16}>
              <Col span={24}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Goal
                </Text>
                <Select
                  style={{ width: "100%" }}
                  value={goal}
                  onChange={setGoal}
                  size="large"
                >
                  <Option value="lose">Lose Weight</Option>
                  <Option value="maintain">Maintain Weight</Option>
                  <Option value="gain">Gain Weight</Option>
                </Select>
              </Col>
            </Row>

            {goal !== "maintain" && (
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong style={{ display: "block", marginBottom: 8 }}>
                    Target Weight Change (kg)
                  </Text>
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="e.g. 5"
                    value={targetWeightChange}
                    onChange={setTargetWeightChange}
                    min={0.5}
                    max={50}
                    step={0.5}
                    size="large"
                  />
                </Col>
                <Col span={12}>
                  <Text strong style={{ display: "block", marginBottom: 8 }}>
                    Time to Reach Goal (weeks)
                  </Text>
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="e.g. 10"
                    value={targetWeeks}
                    onChange={setTargetWeeks}
                    min={1}
                    max={52}
                    step={1}
                    size="large"
                  />
                </Col>
              </Row>
            )}
          </Space>
        </Card>

        {/* Results */}
        {canCalculate && (
          <>
            <Divider>Results</Divider>

            <Card
              style={{
                backgroundColor: "#e6f4ff",
                borderColor: "#91caff",
              }}
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card size="small" style={{ textAlign: "center" }}>
                      <Text type="secondary">BMR (Basal Metabolic Rate)</Text>
                      <Title level={3} style={{ margin: "8px 0" }}>
                        {bmr ? formatNumber(Math.round(bmr)) : "0"}
                      </Title>
                      <Text type="secondary">calories/day</Text>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" style={{ textAlign: "center" }}>
                      <Text type="secondary">TDEE (Maintenance Calories)</Text>
                      <Title level={3} style={{ margin: "8px 0" }}>
                        {tdee ? formatNumber(Math.round(tdee)) : "0"}
                      </Title>
                      <Text type="secondary">calories/day</Text>
                    </Card>
                  </Col>
                </Row>

                {targetCalories && (
                  <>
                    <Card
                      size="small"
                      style={{
                        textAlign: "center",
                        backgroundColor: "#f6ffed",
                        borderColor: "#b7eb8f",
                      }}
                    >
                      <Text strong style={{ fontSize: "16px" }}>
                        🎯 Daily Calorie Target
                      </Text>
                      <Title level={2} style={{ margin: "8px 0" }}>
                        {formatNumber(targetCalories.target)}
                      </Title>
                      <Text>calories/day</Text>
                      {goal !== "maintain" && (
                        <div style={{ marginTop: "12px" }}>
                          <Text type="secondary">
                            {goal === "lose" ? "Deficit: " : "Surplus: "}
                            {formatNumber(
                              Math.abs(targetCalories.dailyDeficit)
                            )}{" "}
                            cal/day
                          </Text>
                        </div>
                      )}
                    </Card>

                    {goal !== "maintain" && (
                      <Card size="small">
                        <Row gutter={16}>
                          <Col span={12}>
                            <Text type="secondary" style={{ display: "block" }}>
                              Total Calories to{" "}
                              {goal === "lose" ? "Lose" : "Gain"}
                            </Text>
                            <Text strong style={{ fontSize: "18px" }}>
                              {formatNumber(totalCalories)} cal
                            </Text>
                          </Col>
                          <Col span={12}>
                            <Text type="secondary" style={{ display: "block" }}>
                              Target Timeline
                            </Text>
                            <Text strong style={{ fontSize: "18px" }}>
                              {targetWeeks || 10} week
                              {(targetWeeks || 10) !== 1 ? "s" : ""}
                            </Text>
                          </Col>
                        </Row>
                      </Card>
                    )}

                    {/* Safety Warning */}
                    {goal !== "maintain" && !isDeficitSafe() && safeRange && (
                      <Alert
                        message="Calorie Deficit/Surplus Outside Safe Range"
                        description={`For healthy and sustainable ${
                          goal === "lose" ? "weight loss" : "weight gain"
                        }, aim for ${safeRange.min}-${
                          safeRange.max
                        } cal/day. Your current plan requires ${Math.abs(
                          targetCalories.dailyDeficit
                        )} cal/day. Consider ${
                          Math.abs(targetCalories.dailyDeficit) > safeRange.max
                            ? "increasing your target weeks"
                            : "decreasing your target weeks"
                        } for better results.`}
                        type="warning"
                        showIcon
                      />
                    )}

                    {/* Success Message */}
                    {goal !== "maintain" && isDeficitSafe() && (
                      <Alert
                        message="Healthy and Sustainable Plan"
                        description={`Your daily ${
                          goal === "lose" ? "deficit" : "surplus"
                        } of ${Math.abs(
                          targetCalories.dailyDeficit
                        )} cal/day is within the recommended safe range.`}
                        type="success"
                        showIcon
                      />
                    )}
                  </>
                )}
              </Space>
            </Card>

            {bodyFat && (
              <Alert
                message="Using Katch-McArdle Formula"
                description="Your body fat percentage is being used for a more accurate calculation based on lean body mass."
                type="info"
                showIcon
              />
            )}

            {!bodyFat && (
              <Alert
                message="Using Mifflin-St Jeor Formula"
                description="For more accurate results, consider adding your body fat percentage."
                type="warning"
                showIcon
              />
            )}
          </>
        )}

        {!canCalculate && (
          <Alert
            message="Please fill in your age, weight, and height to calculate"
            type="info"
            showIcon
          />
        )}
      </Space>
    </ModalContainer>
  );
}
