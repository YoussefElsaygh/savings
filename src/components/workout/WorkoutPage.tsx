"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Tabs,
  Card,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  message,
  Tag,
} from "antd";
import {
  ThunderboltOutlined,
  TrophyOutlined,
  HistoryOutlined,
  FireOutlined,
  ToolOutlined,
} from "@ant-design/icons";
// Workout plans are now generated dynamically based on user preferences
import {
  useWorkoutSessionsFirebase,
  usePersonalRecordsFirebase,
  useWorkoutPreferencesFirebase,
} from "@/hooks/useFirebaseData";
import ActiveWorkoutModal from "./ActiveWorkoutModal";
import PRsSection from "./PRsSection";
import WorkoutHistorySection from "./WorkoutHistorySection";
import WorkoutPreferencesModal from "./WorkoutPreferencesModal";
import LoadingScreen from "@/components/shared/LoadingScreen";
import {
  WorkoutPlan,
  WorkoutSession,
  PersonalRecord,
  WorkoutPreferences,
} from "@/types";
import { generatePersonalizedPlans } from "@/lib/workoutPlanGenerator";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function WorkoutPage() {
  const [activeTab, setActiveTab] = useState("plans");
  const [activeWorkoutPlan, setActiveWorkoutPlan] =
    useState<WorkoutPlan | null>(null);
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [personalizedPlans, setPersonalizedPlans] = useState<WorkoutPlan[]>([]);

  // Firebase hooks
  const [sessions, saveSessions, sessionsLoading, sessionsError, sessionsUser] =
    useWorkoutSessionsFirebase();
  const [
    preferences,
    savePreferences,
    preferencesLoading,
    preferencesError,
    preferencesUser,
  ] = useWorkoutPreferencesFirebase();
  const [personalRecords, savePersonalRecords, prsLoading, prsError, prsUser] =
    usePersonalRecordsFirebase();

  const user = sessionsUser || prsUser;
  const loading = sessionsLoading || prsLoading;

  // Generate personalized plans when preferences load
  useEffect(() => {
    if (preferences && !preferencesLoading) {
      const plans = generatePersonalizedPlans(preferences);
      setPersonalizedPlans(plans);
    } else if (!preferences && !preferencesLoading && user) {
      // Show preferences modal on first load
      setPreferencesModalOpen(true);
    }
  }, [preferences, preferencesLoading, user]);

  // Start a workout
  const handleStartWorkout = (plan: WorkoutPlan) => {
    setActiveWorkoutPlan(plan);
    setWorkoutModalOpen(true);
  };

  // Save completed workout
  const handleSaveWorkout = async (session: WorkoutSession) => {
    try {
      const updatedSessions = [session, ...sessions];
      await saveSessions(updatedSessions);

      // Update PRs
      const newPRs: PersonalRecord[] = [];
      session.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          if (set.completed && set.weight > 0) {
            const existingPR = personalRecords.find(
              (pr) => pr.exerciseId === exercise.exerciseId
            );

            const isPR =
              !existingPR ||
              set.weight > existingPR.weight ||
              (set.weight === existingPR.weight && set.reps > existingPR.reps);

            if (isPR) {
              newPRs.push({
                exerciseId: exercise.exerciseId,
                exerciseName: exercise.exerciseName,
                weight: set.weight,
                reps: set.reps,
                date: session.date,
                timestamp: session.startTime,
              });
            }
          }
        });
      });

      if (newPRs.length > 0) {
        const updatedPRs = [...newPRs, ...personalRecords];
        await savePersonalRecords(updatedPRs);
      }

      setWorkoutModalOpen(false);
      setActiveWorkoutPlan(null);
      setActiveTab("history");
    } catch (error) {
      console.error("Error saving workout:", error);
      message.error("Failed to save workout");
    }
  };

  // Show loading state
  if (loading || !user) {
    return (
      <LoadingScreen
        tip={!user ? "Checking authentication..." : "Loading workout data..."}
      />
    );
  }

  // Show error state (but not authentication errors)
  const isAuthError =
    (sessionsError && sessionsError.includes("sign in")) ||
    (prsError && prsError.includes("sign in"));

  if ((sessionsError || prsError) && !isAuthError) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
        }}
      >
        <Card
          style={{
            textAlign: "center",
            padding: "24px",
            backgroundColor: "#fff1f0",
            borderRadius: "8px",
            border: "1px solid #ffccc7",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <Title level={3} style={{ color: "#cf1322" }}>
            Connection Error
          </Title>
          <Text style={{ color: "#cf1322" }}>{sessionsError || prsError}</Text>
        </Card>
      </div>
    );
  }

  // Calculate current statistics
  const totalWorkouts = sessions.length;
  const recentPRs = personalRecords.filter((pr) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(pr.timestamp) >= thirtyDaysAgo;
  });
  const totalVolume = sessions.reduce((sum, s) => sum + s.totalVolume, 0);

  const getCurrentStreak = (): number => {
    if (sessions.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let checkDate = new Date(today);

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

  // Get personalized plans to show - only if preferences are set
  const getPersonalizedPlansToShow = () => {
    if (!preferences || personalizedPlans.length === 0) {
      return [];
    }
    return personalizedPlans;
  };

  const plansToShow = getPersonalizedPlansToShow();

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
      <div style={{ marginBottom: "32px" }}>
        <Title level={1} style={{ margin: 0, textAlign: "center" }}>
          💪 Workout Tracker
        </Title>
        <Text
          style={{
            display: "block",
            textAlign: "center",
            color: "#8c8c8c",
            marginTop: "8px",
          }}
        >
          Track your workouts, PRs, and crush your goals
        </Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Workouts"
              value={totalWorkouts}
              prefix={<FireOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="PRs This Month"
              value={recentPRs.length}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Volume (kg)"
              value={totalVolume.toLocaleString()}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Current Streak"
              value={currentStreak}
              suffix="days"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Customize Workout Plan Button & Current Preferences */}
      {activeTab === "plans" && (
        <>
          {preferences ? (
            <div style={{ marginBottom: "24px", textAlign: "center" }}>
              <Card
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Title level={4} style={{ color: "white", margin: 0 }}>
                    Your Personalized Plan
                  </Title>
                  <div>
                    <Tag
                      color="purple"
                      style={{ fontSize: "14px", padding: "4px 12px" }}
                    >
                      {preferences.daysPerWeek} days/week
                    </Tag>
                    <Tag
                      color="blue"
                      style={{ fontSize: "14px", padding: "4px 12px" }}
                    >
                      {preferences.experienceLevel}
                    </Tag>
                    <Tag
                      color="green"
                      style={{ fontSize: "14px", padding: "4px 12px" }}
                    >
                      {preferences.equipmentPreference === "free-weights" &&
                        "🏋️ Free Weights"}
                      {preferences.equipmentPreference === "machines" &&
                        "⚙️ Machines"}
                      {preferences.equipmentPreference === "mixed" &&
                        "🔄 Mixed Equipment"}
                      {preferences.equipmentPreference === "bodyweight" &&
                        "💪 Bodyweight"}
                    </Tag>
                  </div>
                  <Button
                    type="default"
                    icon={<ToolOutlined />}
                    onClick={() => setPreferencesModalOpen(true)}
                    style={{
                      marginTop: "8px",
                      background: "white",
                      borderColor: "white",
                    }}
                  >
                    Change Preferences
                  </Button>
                </Space>
              </Card>
            </div>
          ) : (
            <Card
              style={{
                marginBottom: "24px",
                textAlign: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
              }}
            >
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <div>
                  <div style={{ fontSize: "64px", marginBottom: "16px" }}>
                    🏋️
                  </div>
                  <Title level={2} style={{ color: "white", margin: 0 }}>
                    Welcome to Your Workout Tracker!
                  </Title>
                  <Text
                    style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}
                  >
                    Let's create a personalized workout plan just for you
                  </Text>
                </div>
                <Button
                  type="default"
                  size="large"
                  icon={<ToolOutlined />}
                  onClick={() => setPreferencesModalOpen(true)}
                  style={{
                    height: "56px",
                    padding: "0 48px",
                    fontSize: "18px",
                    background: "white",
                    borderColor: "white",
                    fontWeight: "bold",
                  }}
                >
                  Set Up Your Plan
                </Button>
                <Text
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}
                >
                  Choose your training days, experience level, and equipment
                  preference
                </Text>
              </Space>
            </Card>
          )}
        </>
      )}

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane
          tab={
            <span>
              <ThunderboltOutlined />
              Workout Plans
            </span>
          }
          key="plans"
        >
          {/* Personalized Plans Display */}
          {preferences && plansToShow.length > 0 && (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Row gutter={[16, 16]}>
                {plansToShow.map((plan) => (
                  <Col xs={24} sm={12} md={8} key={plan.id}>
                    <Card
                      hoverable
                      style={{
                        height: "100%",
                        border: "2px solid #722ed1",
                      }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Title
                          level={4}
                          style={{ margin: 0, color: "#722ed1" }}
                        >
                          {plan.dayName}
                        </Title>
                        <Text type="secondary">{plan.description}</Text>
                        <div>
                          <Text strong>Exercises: </Text>
                          <Text>{plan.exercises.length}</Text>
                        </div>
                        <div>
                          <Text strong>Volume: </Text>
                          <Text>
                            {plan.exercises[0]?.targetSets || 4} sets ×{" "}
                            {plan.exercises[0]?.targetReps || 10} reps
                          </Text>
                        </div>
                        <Button
                          type="primary"
                          block
                          style={{ marginTop: "12px", background: "#722ed1" }}
                          onClick={() => handleStartWorkout(plan)}
                        >
                          Start Workout
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Space>
          )}

          {/* Show message if no preferences set */}
          {!preferences && (
            <Card style={{ textAlign: "center", padding: "48px" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>💪</div>
              <Title level={3}>No Workout Plans Yet</Title>
              <Text style={{ fontSize: "16px", color: "#8c8c8c" }}>
                Set up your preferences to see personalized workout plans
              </Text>
            </Card>
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <TrophyOutlined />
              Personal Records
            </span>
          }
          key="prs"
        >
          <PRsSection personalRecords={personalRecords} />
        </TabPane>

        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              History
            </span>
          }
          key="history"
        >
          <WorkoutHistorySection sessions={sessions} />
        </TabPane>
      </Tabs>

      {/* Active Workout Modal */}
      {activeWorkoutPlan && (
        <ActiveWorkoutModal
          isOpen={workoutModalOpen}
          onClose={() => {
            setWorkoutModalOpen(false);
            setActiveWorkoutPlan(null);
          }}
          plan={activeWorkoutPlan}
          onSaveWorkout={handleSaveWorkout}
          existingPRs={personalRecords}
        />
      )}

      {/* Workout Preferences Modal */}
      <WorkoutPreferencesModal
        open={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        onSave={(prefs) => {
          savePreferences(prefs);
          const plans = generatePersonalizedPlans(prefs);
          setPersonalizedPlans(plans);
        }}
        currentPreferences={preferences}
      />
    </div>
  );
}
