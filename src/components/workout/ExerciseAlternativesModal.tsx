"use client";

import { Card, Row, Col, Typography, Button, Tag, Space } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { Exercise } from "@/types";
import { EXERCISE_LIBRARY } from "@/constants/exercises-library";
import LazyExerciseGif from "./LazyExerciseGif";
import ModalContainer from "@/components/shared/ModalContainer";

const { Title, Text, Paragraph } = Typography;

interface ExerciseAlternativesModalProps {
  open: boolean;
  onClose: () => void;
  currentExercise: Exercise;
  onSwap: (newExercise: Exercise) => void;
}

export default function ExerciseAlternativesModal({
  open,
  onClose,
  currentExercise,
  onSwap,
}: ExerciseAlternativesModalProps) {
  // Get alternative exercises
  const alternativeExercises = currentExercise.alternatives
    .map((altId) => EXERCISE_LIBRARY.find((ex) => ex.id === altId))
    .filter((ex): ex is Exercise => ex !== undefined);

  const handleSwap = (newExercise: Exercise) => {
    onSwap(newExercise);
    onClose();
  };

  return (
    <ModalContainer
      isOpen={open}
      onClose={onClose}
      title={
        <Space>
          <SwapOutlined style={{ color: "#722ed1" }} />
          <span>Alternative Exercises</span>
        </Space>
      }
      maxWidth={900}
      heightMode="full"
    >
      <div style={{ marginBottom: "24px" }}>
        <Title level={5} style={{ marginBottom: "8px" }}>
          Current Exercise:
        </Title>
        <Card
          style={{
            borderLeft: "4px solid #722ed1",
            background: "#f9f0ff",
          }}
        >
          <Row gutter={16} align="middle">
            <Col xs={24} md={12}>
              <LazyExerciseGif
                src={currentExercise.gifUrl}
                alt={currentExercise.name}
                style={{ minHeight: "200px" }}
              />
            </Col>
            <Col xs={24} md={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <div>
                  <Title level={4} style={{ marginBottom: "4px" }}>
                    {currentExercise.name}
                  </Title>
                  <Tag color="purple">{currentExercise.muscleGroup}</Tag>
                  {currentExercise.equipment.map((eq) => (
                    <Tag key={eq}>{eq}</Tag>
                  ))}
                </div>
                <Paragraph style={{ marginBottom: 0 }}>
                  {currentExercise.description}
                </Paragraph>
              </Space>
            </Col>
          </Row>
        </Card>
      </div>

      {alternativeExercises.length > 0 ? (
        <>
          <Title level={5} style={{ marginTop: "24px", marginBottom: "16px" }}>
            Choose an Alternative ({alternativeExercises.length}):
          </Title>
          <Row gutter={[16, 16]}>
            {alternativeExercises.map((exercise) => (
              <Col xs={24} key={exercise.id}>
                <Card
                  hoverable
                  onClick={() => handleSwap(exercise)}
                  style={{
                    border: "1px solid #d9d9d9",
                    transition: "all 0.3s",
                  }}
                  styles={{
                    body: { padding: "16px" },
                  }}
                >
                  <Row gutter={16} align="middle">
                    <Col xs={24} sm={8}>
                      <LazyExerciseGif
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        style={{ minHeight: "150px", padding: "10px" }}
                      />
                    </Col>
                    <Col xs={24} sm={14}>
                      <Space
                        direction="vertical"
                        size="small"
                        style={{ width: "100%" }}
                      >
                        <div>
                          <Title level={5} style={{ marginBottom: "4px" }}>
                            {exercise.name}
                          </Title>
                          <div>
                            <Tag color="purple">{exercise.muscleGroup}</Tag>
                            {exercise.equipment.map((eq) => (
                              <Tag key={eq}>{eq}</Tag>
                            ))}
                          </div>
                        </div>
                        <Text>{exercise.description}</Text>
                      </Space>
                    </Col>
                    <Col xs={24} sm={2} style={{ textAlign: "center" }}>
                      <Button
                        type="primary"
                        icon={<SwapOutlined />}
                        size="large"
                        style={{
                          background: "#722ed1",
                        }}
                      >
                        Swap
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <Card>
          <Text type="secondary">
            No alternatives available for this exercise.
          </Text>
        </Card>
      )}
    </ModalContainer>
  );
}
