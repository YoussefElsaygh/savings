"use client";

import { CalorieGoal } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Card, Progress, Space, Typography, Alert, Row, Col, Statistic } from "antd";
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
  const daysToGoal = Math.ceil(
    remainingCaloriesToLose / ((calorieGoal.targetWeightLoss * 7700) / 7)
  );

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
          <Col span={8}>
            <Statistic
              title="Goal"
              value={formatNumber(calorieGoal.totalCaloriesToLose)}
              suffix="cal"
              valueStyle={{ fontSize: "16px", color: "#8b5cf6" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Achieved"
              value={formatNumber(totalDeficitAchieved)}
              suffix="cal"
              prefix={<FireOutlined />}
              valueStyle={{ fontSize: "16px", color: "#52c41a" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Remaining"
              value={formatNumber(remainingCaloriesToLose)}
              suffix="cal"
              valueStyle={{ fontSize: "16px", color: "#fa8c16" }}
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
            percent={Math.min(progressPercent, 100)}
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
                At {formatNumber((calorieGoal.targetWeightLoss * 7700) / 7)}{" "}
                calories/day, you&apos;ll reach it in about {daysToGoal} days.
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
