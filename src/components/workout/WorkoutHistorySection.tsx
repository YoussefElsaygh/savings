"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Tag,
  Empty,
  Typography,
  Space,
  Row,
  Col,
  Statistic,
  Timeline,
} from "antd";
import {
  HistoryOutlined,
  FireOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { WorkoutSession } from "@/types";
import WorkoutDetailModal from "./WorkoutDetailModal";

const { Text, Title } = Typography;

interface WorkoutHistorySectionProps {
  sessions: WorkoutSession[];
}

export default function WorkoutHistorySection({
  sessions,
}: WorkoutHistorySectionProps) {
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(
    null
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleRowClick = (session: WorkoutSession) => {
    setSelectedSession(session);
    setDetailModalOpen(true);
  };
  if (sessions.length === 0) {
    return (
      <Card>
        <Empty
          description={
            <span>
              No workout history yet! Start your first workout to begin
              tracking.
            </span>
          }
          image={
            <HistoryOutlined style={{ fontSize: "64px", color: "#d9d9d9" }} />
          }
        />
      </Card>
    );
  }

  // Sort sessions by date, newest first
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  // Calculate statistics
  const totalWorkouts = sessions.length;
  const totalVolume = sessions.reduce((sum, s) => sum + s.totalVolume, 0);
  const avgVolume = totalVolume / totalWorkouts;
  const avgDuration =
    sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / totalWorkouts;

  // Get current week streak
  const getCurrentStreak = (): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    const checkDate = new Date(today);

    while (true) {
      const hasWorkout = sessions.some((session) => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkDate.getTime();
      });

      if (hasWorkout) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (streak > 0 || checkDate.getTime() === today.getTime()) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = getCurrentStreak();

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string, record: WorkoutSession) => (
        <Space direction="vertical" size={0}>
          <Text strong>{new Date(date).toLocaleDateString()}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {new Date(record.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Space>
      ),
      sorter: (a: WorkoutSession, b: WorkoutSession) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    },
    {
      title: "Workout",
      dataIndex: "planName",
      key: "planName",
      render: (name: string) => <Text strong>{name || "Custom Workout"}</Text>,
    },
    {
      title: "Exercises",
      key: "exercises",
      render: (_: unknown, record: WorkoutSession) => (
        <Text>{record.exercises.length} exercises</Text>
      ),
    },
    {
      title: "Volume",
      dataIndex: "totalVolume",
      key: "totalVolume",
      render: (volume: number) => (
        <Space>
          <FireOutlined style={{ color: "#fa8c16" }} />
          <Text strong>{volume.toLocaleString()} kg</Text>
        </Space>
      ),
      sorter: (a: WorkoutSession, b: WorkoutSession) =>
        b.totalVolume - a.totalVolume,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{duration} min</Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "completed",
      key: "completed",
      render: (completed: boolean) => (
        <Tag color={completed ? "success" : "warning"}>
          {completed ? "Completed" : "In Progress"}
        </Tag>
      ),
    },
  ];

  // Get last 5 workouts for timeline
  const recentWorkouts = sortedSessions.slice(0, 5);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Summary Stats */}
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Workouts"
              value={totalWorkouts}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Current Streak"
              value={currentStreak}
              suffix="days"
              prefix={<FireOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Volume"
              value={totalVolume.toLocaleString()}
              suffix="kg"
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Avg Duration"
              value={Math.round(avgDuration)}
              suffix="min"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Timeline */}
      <Card title={<Title level={4}>Recent Activity</Title>}>
        <Timeline
          items={recentWorkouts.map((session) => ({
            color: session.completed ? "green" : "blue",
            children: (
              <Space direction="vertical" size={0}>
                <Text strong>{session.planName || "Custom Workout"}</Text>
                <Text type="secondary">
                  {new Date(session.date).toLocaleDateString()} -{" "}
                  {session.exercises.length} exercises, {session.totalVolume} kg
                  volume
                </Text>
              </Space>
            ),
          }))}
        />
      </Card>

      {/* Full History Table */}
      <Card title={<Title level={4}>Complete History</Title>}>
        <Table
          dataSource={sortedSessions}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      {/* Workout Detail Modal */}
      <WorkoutDetailModal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedSession(null);
        }}
        session={selectedSession}
      />

      {/* Volume Chart Placeholder */}
      <Card title={<Title level={4}>📊 Volume Over Time</Title>}>
        <div
          style={{
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fafafa",
            borderRadius: "8px",
          }}
        >
          <Space direction="vertical" align="center">
            <Text type="secondary">
              📈 Chart integration coming soon! Your volume trend will appear
              here.
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Avg Volume: {Math.round(avgVolume)} kg | Highest:{" "}
              {Math.max(...sessions.map((s) => s.totalVolume))} kg
            </Text>
          </Space>
        </div>
      </Card>
    </Space>
  );
}
