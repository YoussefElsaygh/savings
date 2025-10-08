"use client";

import { CalorieGoal, DailyCalorieData } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Card, Progress, Space, Typography, Statistic, Row, Col } from "antd";
import {
  FireOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface TodayProgressSectionProps {
  calorieGoal: CalorieGoal | null;
  todayData: DailyCalorieData;
}

export default function TodayProgressSection({
  calorieGoal,
  todayData,
}: TodayProgressSectionProps) {
  if (!calorieGoal) return null;

  const progressPercent =
    (todayData.totalCalories / todayData.calorieLimit) * 100;
  const todayDeficit = calorieGoal?.maintenanceCalories
    ? Math.max(calorieGoal.maintenanceCalories - todayData.totalCalories, 0) +
      (todayData.totalCaloriesBurned || 0)
    : 0;

  return (
    <Card
      style={{ background: "#f6ffed", borderColor: "#b7eb8f" }}
      title={
        <Space>
          <CheckCircleOutlined style={{ fontSize: "18px" }} />
          <span>Today's Progress</span>
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Statistic
              title="Calorie Limit"
              value={formatNumber(todayData.calorieLimit)}
              suffix="cal"
              valueStyle={{ fontSize: "16px" }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Consumed"
              value={formatNumber(todayData.totalCalories)}
              suffix="cal"
              valueStyle={{ fontSize: "16px" }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Remaining"
              value={formatNumber(todayData.remainingCalories)}
              suffix="cal"
              valueStyle={{
                fontSize: "16px",
                color: todayData.remainingCalories >= 0 ? "#52c41a" : "#ff4d4f",
              }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Burned (Exercise)"
              value={formatNumber(todayData.totalCaloriesBurned || 0)}
              suffix="cal"
              prefix={<ThunderboltOutlined />}
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
            <Text>Daily Limit Progress</Text>
            <Text strong>{progressPercent.toFixed(1)}%</Text>
          </div>
          <Progress
            percent={Math.min(progressPercent, 100)}
            strokeColor={
              todayData.totalCalories <= todayData.calorieLimit
                ? "#52c41a"
                : "#ff4d4f"
            }
            showInfo={false}
            strokeWidth={12}
          />
        </div>

        <Card
          size="small"
          style={{ background: "#fffbe6", borderColor: "#ffe58f" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space>
              <FireOutlined style={{ fontSize: "20px", color: "#faad14" }} />
              <Text strong>Today's Total Deficit:</Text>
            </Space>
            <Text strong style={{ fontSize: "18px", color: "#52c41a" }}>
              {formatNumber(todayDeficit)} cal
            </Text>
          </div>
        </Card>
      </Space>
    </Card>
  );
}
