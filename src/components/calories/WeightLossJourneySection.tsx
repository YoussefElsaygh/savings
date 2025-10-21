"use client";

import { CalorieGoal } from "@/types";
import { formatNumber } from "@/lib/utils";
import {
  Card,
  Progress,
  Space,
  Typography,
  Alert,
  Row,
  Col,
  Statistic,
} from "antd";
import { TrophyOutlined, RiseOutlined, FireOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface WeightLossJourneySectionProps {
  calorieGoal: CalorieGoal | null;
  totalDeficitAchieved: number;
  remainingCaloriesToLose: number;
}

export default function WeightLossJourneySection({
  calorieGoal,
  totalDeficitAchieved,
  remainingCaloriesToLose,
}: WeightLossJourneySectionProps) {
  if (!calorieGoal?.totalCaloriesToLose) return null;

  const progressPercent =
    calorieGoal.totalCaloriesToLose > 0
      ? (totalDeficitAchieved / calorieGoal.totalCaloriesToLose) * 100
      : 0;

  const isGoalReached = totalDeficitAchieved >= calorieGoal.totalCaloriesToLose;

  // Calculate the daily deficit from maintenance calories
  const dailyDeficit = calorieGoal.maintenanceCalories
    ? calorieGoal.maintenanceCalories - calorieGoal.dailyCalorieLimit
    : 500; // Default to 500 if maintenance not set

  const daysToGoal =
    dailyDeficit > 0 ? Math.ceil(remainingCaloriesToLose / dailyDeficit) : 0;

  const weeksToGoal = daysToGoal / 7;

  // Calculate kg lost (approximately 7,700 calories = 1 kg)
  const kgLost = totalDeficitAchieved / 7700;
  const totalKgGoal = calorieGoal.totalCaloriesToLose / 7700;

  return (
    <Card
      style={{
        background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
        borderColor: "#c4b5fd",
      }}
      title={
        <Space>
          <TrophyOutlined style={{ fontSize: "20px" }} />
          <span>🎯 Your Weight Loss Journey</span>
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Statistic
              title="Goal"
              value={formatNumber(calorieGoal.totalCaloriesToLose)}
              suffix="cal"
              valueStyle={{ fontSize: "16px", color: "#8b5cf6" }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Achieved"
              value={formatNumber(totalDeficitAchieved)}
              suffix="cal"
              prefix={<FireOutlined />}
              valueStyle={{ fontSize: "16px", color: "#52c41a" }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Remaining"
              value={formatNumber(remainingCaloriesToLose)}
              suffix="cal"
              valueStyle={{ fontSize: "16px", color: "#fa8c16" }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Weight Lost"
              value={kgLost.toFixed(2)}
              suffix={`/ ${totalKgGoal.toFixed(1)} kg`}
              valueStyle={{
                fontSize: "16px",
                color: "#d946ef",
                fontWeight: "bold",
              }}
            />
          </Col>
        </Row>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text strong>Progress:</Text>
            <Text strong style={{ color: "#8b5cf6" }}>
              {progressPercent.toFixed(1)}% Complete
            </Text>
          </div>
          <Progress
            percent={Math.min(Number(progressPercent.toFixed(1)), 100)}
            strokeColor={{
              "0%": "#8b5cf6",
              "100%": "#52c41a",
            }}
            strokeWidth={16}
          />
        </div>

        {isGoalReached ? (
          <Alert
            message={
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                  🎉 🏆 🎉
                </div>
                <Text strong style={{ fontSize: "16px" }}>
                  Congratulations! You&apos;ve reached your goal!
                </Text>
              </div>
            }
            description={
              <div style={{ textAlign: "center" }}>
                You&apos;ve successfully created a deficit of{" "}
                {formatNumber(totalDeficitAchieved)} calories!
              </div>
            }
            type="success"
            showIcon={false}
          />
        ) : (
          <Alert
            message={
              <Text strong>
                Keep going! You&apos;re {formatNumber(remainingCaloriesToLose)}{" "}
                calories away from your goal.
              </Text>
            }
            description={
              <Text>
                At {formatNumber(dailyDeficit)} cal/day deficit, you&apos;ll
                reach it in about {daysToGoal} day{daysToGoal !== 1 ? "s" : ""}{" "}
                ({weeksToGoal.toFixed(1)} week
                {weeksToGoal.toFixed(1) !== "1.0" ? "s" : ""}).
              </Text>
            }
            type="info"
            showIcon
            icon={<RiseOutlined />}
          />
        )}
      </Space>
    </Card>
  );
}
