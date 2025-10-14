"use client";

import {
  Typography,
  Space,
  Row,
  Col,
  Card,
  Tag,
  Divider,
  Statistic,
  Table,
} from "antd";
import {
  FireOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { WorkoutSession } from "@/types";
import ModalContainer from "@/components/shared/ModalContainer";

const { Title, Text } = Typography;

interface WorkoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: WorkoutSession | null;
}

export default function WorkoutDetailModal({
  isOpen,
  onClose,
  session,
}: WorkoutDetailModalProps) {
  if (!session) return null;

  const columns = [
    {
      title: "Set",
      dataIndex: "setNumber",
      key: "setNumber",
      width: 60,
      render: (num: number) => <Text strong>#{num}</Text>,
    },
    {
      title: "Weight (kg)",
      dataIndex: "weight",
      key: "weight",
      render: (weight: number) => (
        <Text strong style={{ color: "#1890ff" }}>
          {weight} kg
        </Text>
      ),
    },
    {
      title: "Reps",
      dataIndex: "reps",
      key: "reps",
    },
    {
      title: "Volume",
      dataIndex: "volume",
      key: "volume",
      render: (volume: number) => <Text>{volume} kg</Text>,
    },
    {
      title: "Status",
      dataIndex: "completed",
      key: "completed",
      render: (completed: boolean) =>
        completed ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Done
          </Tag>
        ) : (
          <Tag>Skipped</Tag>
        ),
    },
  ];

  const totalSets = session.exercises.reduce(
    (sum, ex) => sum + ex.sets.length,
    0
  );
  const completedSets = session.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  );

  return (
    <ModalContainer
      title={
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: "18px" }}>
            {session.planName || "Custom Workout"}
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {new Date(session.date).toLocaleDateString()} at{" "}
            {new Date(session.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Space>
      }
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={1000}
      heightMode="full"
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Summary Stats */}
        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Duration"
                value={session.duration}
                suffix="min"
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Total Volume"
                value={session.totalVolume}
                suffix="kg"
                prefix={<FireOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Exercises"
                value={session.exercises.length}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Sets Completed"
                value={`${completedSets}/${totalSets}`}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Exercise Breakdown */}
        <div>
          <Title level={4}>Exercise Breakdown</Title>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {session.exercises.map((exercise, index) => {
              const exerciseVolume = exercise.sets
                .filter((s) => s.completed)
                .reduce((sum, s) => sum + s.weight * s.reps, 0);

              const exerciseData = exercise.sets.map((set, setIndex) => ({
                key: set.id,
                setNumber: setIndex + 1,
                weight: set.weight,
                reps: set.reps,
                volume: set.weight * set.reps,
                completed: set.completed,
              }));

              const maxWeight = Math.max(
                ...exercise.sets.map((s) => s.weight),
                0
              );
              const isPRCandidate = maxWeight > 0;

              return (
                <Card key={exercise.exerciseId} size="small">
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {index + 1}. {exercise.exerciseName}
                      </Title>
                      <Text type="secondary">
                        Volume: {exerciseVolume} kg
                        {isPRCandidate && (
                          <Tag
                            color="gold"
                            style={{ marginLeft: "8px" }}
                            icon={<TrophyOutlined />}
                          >
                            Max: {maxWeight} kg
                          </Tag>
                        )}
                      </Text>
                    </div>
                  </Space>

                  <Divider style={{ margin: "12px 0" }} />

                  <Table
                    dataSource={exerciseData}
                    columns={columns}
                    pagination={false}
                    size="small"
                  />
                </Card>
              );
            })}
          </Space>
        </div>

        {/* Notes if available */}
        {session.notes && (
          <Card title="Workout Notes">
            <Text>{session.notes}</Text>
          </Card>
        )}
      </Space>
    </ModalContainer>
  );
}

