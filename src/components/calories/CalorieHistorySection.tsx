"use client";

import { CalorieGoal, DailyCalorieData } from "@/types";
import { formatNumber } from "@/lib/utils";
import {
  Card,
  Space,
  Typography,
  Button,
  Tag,
  Statistic,
  Row,
  Col,
  Badge,
  Collapse,
} from "antd";
import {
  CalendarOutlined,
  EditOutlined,
  TrophyOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface CalorieHistorySectionProps {
  dailyData: DailyCalorieData[];
  calorieGoal: CalorieGoal | null;
  normalizeData: (data: DailyCalorieData[]) => DailyCalorieData[];
  getTotalDeficitAchieved: () => number;
  getTodayDate: () => string;
  onEditDay: (date: string) => void;
}

export default function CalorieHistorySection({
  dailyData,
  calorieGoal,
  normalizeData,
  getTotalDeficitAchieved,
  getTodayDate,
  onEditDay,
}: CalorieHistorySectionProps) {
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
                        <Tag color="green">
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
                  </div>
                )}
              </Card>
            );
          })}
      </div>
    </Card>
  );
}
