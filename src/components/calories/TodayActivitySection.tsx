"use client";

import { DailyCalorieData } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Card, Space, Typography, Button, List, Tag } from "antd";
import { AppleOutlined, ThunderboltOutlined, CloseOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface TodayActivitySectionProps {
  todayData: DailyCalorieData;
  onDeleteFood: (foodId: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
}

export default function TodayActivitySection({
  todayData,
  onDeleteFood,
  onDeleteExercise,
}: TodayActivitySectionProps) {
  const hasActivity =
    todayData.foodEntries.length > 0 ||
    (todayData.exerciseEntries && todayData.exerciseEntries.length > 0);

  if (!hasActivity) return null;

  return (
    <Card title="Today's Activity">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Food Entries */}
        {todayData.foodEntries.length > 0 && (
          <div>
            <Title level={5} style={{ marginBottom: 16 }}>
              <AppleOutlined style={{ marginRight: 8 }} />
              Food Entries ({todayData.foodEntries.length} items)
            </Title>
            <List
              dataSource={todayData.foodEntries}
              renderItem={(entry) => (
                <List.Item
                  key={entry.id}
                  style={{
                    background: "#f6ffed",
                    padding: "12px",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    border: "1px solid #b7eb8f",
                  }}
                  extra={
                    <Button
                      type="text"
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => onDeleteFood(entry.id)}
                      title="Delete food entry"
                    />
                  }
                >
                  <List.Item.Meta
                    title={<Text strong>{entry.name}</Text>}
                    description={
                      <Space size="small">
                        <Tag icon={<ClockCircleOutlined />} color="green">
                          {new Date(entry.timestamp).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </Tag>
                        <Tag color="green">
                          {formatNumber(entry.calories)} calories
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}

        {/* Exercise Entries */}
        {todayData.exerciseEntries && todayData.exerciseEntries.length > 0 && (
          <div>
            <Title level={5} style={{ marginBottom: 16 }}>
              <ThunderboltOutlined style={{ marginRight: 8 }} />
              Exercise Entries ({todayData.exerciseEntries.length} items)
            </Title>
            <List
              dataSource={todayData.exerciseEntries}
              renderItem={(entry) => (
                <List.Item
                  key={entry.id}
                  style={{
                    background: "#fff7e6",
                    padding: "12px",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    border: "1px solid #ffd591",
                  }}
                  extra={
                    <Button
                      type="text"
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => onDeleteExercise(entry.id)}
                      title="Delete exercise entry"
                    />
                  }
                >
                  <List.Item.Meta
                    title={<Text strong>{entry.name}</Text>}
                    description={
                      <Space size="small">
                        <Tag icon={<ClockCircleOutlined />} color="orange">
                          {new Date(entry.timestamp).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </Tag>
                        <Tag color="orange">
                          {entry.durationMinutes} min
                        </Tag>
                        <Tag color="orange">
                          {formatNumber(entry.caloriesBurned)} cal burned
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Space>
    </Card>
  );
}
