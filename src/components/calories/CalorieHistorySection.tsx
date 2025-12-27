"use client";

import { useState } from "react";
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
}

export default function CalorieHistorySection({
  dailyData,
  calorieGoal,
  normalizeData,
  getTotalDeficitAchieved,
  getTodayDate,
  onEditDay,
}: CalorieHistorySectionProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const toggleDay = (date: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDays(newExpanded);
  };

  // Generate all dates to display (last 30 days or from first entry, whichever is more)
  const generateAllDates = (): DailyCalorieData[] => {
    const today = new Date(getTodayDate());
    const dates: string[] = [];
    
    // If no data exists, only show today
    if (dailyData.length === 0) {
      const todayStr = getTodayDate();
      return [
        {
          date: todayStr,
          totalCalories: 0,
          totalCaloriesBurned: 0,
          foodEntries: [],
          exerciseEntries: [],
          remainingCalories: calorieGoal?.dailyCalorieLimit || 2000,
          calorieLimit: calorieGoal?.dailyCalorieLimit || 2000,
        },
      ];
    }
    
    // Determine the start date: either 30 days ago or the earliest entry date
    const earliestEntry = dailyData.reduce((earliest, day) => {
      const dayDate = new Date(day.date);
      return dayDate < new Date(earliest) ? day.date : earliest;
    }, dailyData[0].date);
    
    const earliestDate = new Date(earliestEntry);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    
    // Use whichever is earlier
    const startDate = earliestDate < thirtyDaysAgo ? earliestDate : thirtyDaysAgo;
    
    // Generate all dates from start to today
    const currentDate = new Date(startDate);
    while (currentDate <= today) {
      dates.push(new Intl.DateTimeFormat("en-CA").format(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Create a map of existing data
    const dataMap = new Map<string, DailyCalorieData>();
    normalizeData(dailyData).forEach((day) => {
      dataMap.set(day.date, day);
    });
    
    // Fill in all dates, using existing data or creating empty entries
    return dates.map((date) => {
      if (dataMap.has(date)) {
        return dataMap.get(date)!;
      } else {
        // Create empty day entry
        return {
          date,
          totalCalories: 0,
          totalCaloriesBurned: 0,
          foodEntries: [],
          exerciseEntries: [],
          remainingCalories: calorieGoal?.dailyCalorieLimit || 2000,
          calorieLimit: calorieGoal?.dailyCalorieLimit || 2000,
        };
      }
    });
  };

  const allDates = generateAllDates();

  const daysWithData = allDates.filter(
    (day) => day.foodEntries.length > 0 || (day.exerciseEntries?.length || 0) > 0
  );

  const deficitDaysCount = daysWithData.filter((day) => {
    const foodDeficit = calorieGoal?.maintenanceCalories
      ? Math.max(calorieGoal.maintenanceCalories - day.totalCalories, 0)
      : 0;
    const exerciseBonus = day.totalCaloriesBurned || 0;
    return foodDeficit + exerciseBonus > 0;
  }).length;

  const totalActivities = daysWithData.reduce(
    (sum, day) =>
      sum + day.foodEntries.length + (day.exerciseEntries?.length || 0),
    0
  );

  const avgCaloriesPerDay =
    daysWithData.length > 0
      ? Math.round(
          daysWithData.reduce((sum, day) => sum + day.totalCalories, 0) /
            daysWithData.length
        )
      : 0;

  return (
    <Card
      style={{ marginTop: 32 }}
      title={
        <Space>
          <CalendarOutlined />
          <span>
            Daily Calorie History ({allDates.length} days, {daysWithData.length}{" "}
            tracked)
          </span>
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
        {allDates
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((day) => {
            const isToday = day.date === getTodayDate();
            const isEmpty =
              day.foodEntries.length === 0 &&
              (day.exerciseEntries?.length || 0) === 0;
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
                  background: isEmpty
                    ? "#fff"
                    : isToday
                    ? "#e6f4ff"
                    : "#fafafa",
                  borderColor: isEmpty
                    ? "#e8e8e8"
                    : isToday
                    ? "#91caff"
                    : "#d9d9d9",
                  borderStyle: isEmpty ? "dashed" : "solid",
                  cursor: "pointer",
                  opacity: isEmpty ? 0.7 : 1,
                }}
                onClick={() => toggleDay(day.date)}
                hoverable
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
                    {isEmpty && <Tag color="default">No entries</Tag>}
                  </Space>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditDay(day.date);
                    }}
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
                                <Tag color="green" style={{ margin: 0 }}>
                                  {formatNumber(food.calories)} cal
                                </Tag>
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
    </Card>
  );
}
