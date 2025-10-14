"use client";

import { Card, Table, Tag, Empty, Typography, Space, Statistic, Row, Col } from "antd";
import { TrophyOutlined, RiseOutlined } from "@ant-design/icons";
import { PersonalRecord } from "@/types";

const { Text, Title } = Typography;

interface PRsSectionProps {
  personalRecords: PersonalRecord[];
}

export default function PRsSection({ personalRecords }: PRsSectionProps) {
  if (personalRecords.length === 0) {
    return (
      <Card>
        <Empty
          description={
            <span>
              No PRs yet! Complete workouts to track your personal records.
            </span>
          }
          image={<TrophyOutlined style={{ fontSize: "64px", color: "#d9d9d9" }} />}
        />
      </Card>
    );
  }

  // Get latest PRs per exercise
  const latestPRs = personalRecords.reduce((acc, pr) => {
    const existing = acc.find((p) => p.exerciseId === pr.exerciseId);
    if (!existing || new Date(pr.timestamp) > new Date(existing.timestamp)) {
      return [...acc.filter((p) => p.exerciseId !== pr.exerciseId), pr];
    }
    return acc;
  }, [] as PersonalRecord[]);

  // Sort by date, newest first
  const sortedPRs = [...latestPRs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Get recent PRs (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentPRs = personalRecords.filter(
    (pr) => new Date(pr.timestamp) >= thirtyDaysAgo
  );

  const columns = [
    {
      title: "Exercise",
      dataIndex: "exerciseName",
      key: "exerciseName",
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      render: (weight: number) => (
        <Space>
          <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
            {weight} kg
          </Text>
        </Space>
      ),
      sorter: (a: PersonalRecord, b: PersonalRecord) => b.weight - a.weight,
    },
    {
      title: "Reps",
      dataIndex: "reps",
      key: "reps",
      render: (reps: number) => <Text>{reps} reps</Text>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string, record: PersonalRecord) => {
        const daysAgo = Math.floor(
          (Date.now() - new Date(record.timestamp).getTime()) / (1000 * 60 * 60 * 24)
        );
        const isRecent = daysAgo <= 7;
        return (
          <Space>
            <Text>{new Date(date).toLocaleDateString()}</Text>
            {isRecent && <Tag color="gold">NEW</Tag>}
          </Space>
        );
      },
      sorter: (a: PersonalRecord, b: PersonalRecord) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Summary Stats */}
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total PRs"
              value={latestPRs.length}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="PRs This Month"
              value={recentPRs.length}
              prefix={<RiseOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Heaviest Lift"
              value={Math.max(...latestPRs.map((pr) => pr.weight), 0)}
              suffix="kg"
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* PRs Table */}
      <Card title={<Title level={4}>🏆 Your Personal Records</Title>}>
        <Table
          dataSource={sortedPRs}
          columns={columns}
          rowKey="exerciseId"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Recent PRs */}
      {recentPRs.length > 0 && (
        <Card
          title={<Title level={4}>🔥 Recent PRs (Last 30 Days)</Title>}
          style={{ background: "#fff7e6", borderColor: "#ffd591" }}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            {recentPRs
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              )
              .slice(0, 5)
              .map((pr) => (
                <Card key={pr.timestamp} size="small">
                  <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <div>
                      <Text strong>{pr.exerciseName}</Text>
                      <br />
                      <Text type="secondary">
                        {new Date(pr.date).toLocaleDateString()}
                      </Text>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text strong style={{ fontSize: "18px", color: "#fa8c16" }}>
                        {pr.weight} kg
                      </Text>
                      <br />
                      <Text type="secondary">{pr.reps} reps</Text>
                    </div>
                  </Space>
                </Card>
              ))}
          </Space>
        </Card>
      )}
    </Space>
  );
}

