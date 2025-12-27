"use client";

import { useState, useEffect, useRef } from "react";
import {
  FOOD_CATEGORIES,
  getFoodsByCategory,
  calculateCalories,
  type FoodConstant,
} from "@/constants/foods";
import {
  Button,
  Input,
  Select,
  InputNumber,
  Tabs,
  Card,
  Row,
  Col,
  List,
} from "antd";
import { PlusOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import ModalContainer from "@/components/shared/ModalContainer";

const { TabPane } = Tabs;

interface FoodToAdd {
  id: string;
  name: string;
  calories: number;
  description: string;
}

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: {
    name: string;
    calories: number;
    description: string;
  }) => void;
  onAddFoods?: (
    foods: Array<{
      name: string;
      calories: number;
      description: string;
    }>
  ) => Promise<void>;
}

export default function AddEntryModal({
  isOpen,
  onClose,
  onAddFood,
  onAddFoods,
}: AddEntryModalProps) {
  // Food entry states
  const [foodEntryMode, setFoodEntryMode] = useState<"preset" | "custom">(
    "preset"
  );
  const [selectedFood, setSelectedFood] = useState<FoodConstant | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<"pieces" | "grams" | "ml">("grams");
  const [customFoodName, setCustomFoodName] = useState("");
  const [customCalories, setCustomCalories] = useState("");
  const [calculatedCalories, setCalculatedCalories] = useState(0);
  const [foodsToAdd, setFoodsToAdd] = useState<FoodToAdd[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const quantityInputRef = useRef<React.ComponentRef<typeof InputNumber>>(null);

  const foodsByCategory = getFoodsByCategory();

  // Set appropriate unit when food is selected and focus quantity input
  useEffect(() => {
    if (selectedFood) {
      // Auto-set unit based on food type
      if (selectedFood.unitType === "piece") {
        setUnit("pieces");
      } else if (selectedFood.unitType === "100g") {
        setUnit("grams");
      } else if (selectedFood.unitType === "100ml") {
        setUnit("ml");
      }

      // Focus quantity input after a short delay to ensure rendering
      setTimeout(() => {
        quantityInputRef.current?.focus();
      }, 100);
    }
  }, [selectedFood]);

  // Calculate calories when preset food selection changes
  useEffect(() => {
    if (foodEntryMode === "preset" && selectedFood && quantity) {
      const qty = parseFloat(quantity);
      if (qty > 0) {
        const calories = calculateCalories(selectedFood, qty, unit);
        setCalculatedCalories(Math.round(calories));
      } else {
        setCalculatedCalories(0);
      }
    } else {
      setCalculatedCalories(0);
    }
  }, [selectedFood, quantity, unit, foodEntryMode]);

  const handleAddToList = () => {
    let calories: number;
    let name: string;
    let description: string;

    if (foodEntryMode === "preset" && selectedFood && quantity) {
      const qty = parseFloat(quantity);
      if (qty > 0) {
        calories = calculateCalories(selectedFood, qty, unit);
        name = selectedFood.name;
        description = `${qty} ${
          unit === "pieces"
            ? qty === 1
              ? "piece"
              : "pieces"
            : unit === "ml"
            ? "ml"
            : "g"
        }`;
      } else {
        return;
      }
    } else if (foodEntryMode === "custom") {
      const customCals = parseFloat(customCalories);
      const customName = customFoodName.trim();
      if (!customName || customCals <= 0) {
        return;
      }
      calories = customCals;
      name = customName;
      description = "custom entry";
    } else {
      return;
    }

    if (calories > 0) {
      const newFood: FoodToAdd = {
        id: `${Date.now()}-${Math.random()}`,
        name: `${name} (${description})`,
        calories: Math.round(calories),
        description,
      };
      setFoodsToAdd([...foodsToAdd, newFood]);

      // Reset form but keep modal open
      resetFoodForm();
    }
  };

  const handleAddAllFoods = async () => {
    setIsAdding(true);
    try {
      if (onAddFoods) {
        // Use batch add if available (more reliable)
        const foodsData = foodsToAdd.map((food) => ({
          name: food.name,
          calories: food.calories,
          description: food.description,
        }));
        await onAddFoods(foodsData);
      } else {
        // Fallback to sequential adds
        for (const food of foodsToAdd) {
          await onAddFood({
            name: food.name,
            calories: food.calories,
            description: food.description,
          });
          // Longer delay to ensure Firebase sync and state updates complete
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      // Reset everything and close modal
      setFoodsToAdd([]);
      resetFoodForm();
      onClose();
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromList = (id: string) => {
    setFoodsToAdd(foodsToAdd.filter((food) => food.id !== id));
  };

  const resetFoodForm = () => {
    setQuantity("");
    setCustomFoodName("");
    setCustomCalories("");
    setSelectedFood(null);
    setCalculatedCalories(0);
  };

  const handleClose = () => {
    setFoodsToAdd([]);
    resetFoodForm();
    onClose();
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={handleClose}
      title="🍎 Add Food"
      maxWidth={1100}
      heightMode="full"
      compactPadding={true}
      footer={[
        <Button key="cancel" onClick={handleClose} size="large">
          Cancel
        </Button>,
        <Button
          key="add-to-list"
          onClick={handleAddToList}
          icon={<PlusOutlined />}
          size="large"
          style={{
            borderColor: "#1890ff",
            color: "#1890ff",
            borderWidth: "2px",
          }}
          disabled={
            (foodEntryMode === "preset" &&
              (!selectedFood || !quantity || parseFloat(quantity) <= 0)) ||
            (foodEntryMode === "custom" &&
              (!customFoodName.trim() ||
                !customCalories ||
                parseFloat(customCalories) <= 0))
          }
        >
          Add
        </Button>,
        <Button
          key="submit"
          onClick={handleAddAllFoods}
          icon={<CheckOutlined />}
          size="large"
          type="primary"
          loading={isAdding}
          style={{
            background: "#52c41a",
            borderColor: "#52c41a",
            color: "#fff",
          }}
          disabled={foodsToAdd.length === 0 || isAdding}
        >
          {isAdding
            ? `Adding ${foodsToAdd.length}...`
            : `Done (${foodsToAdd.length})`}
        </Button>,
      ]}
    >
      <div>
        {foodsToAdd.length > 0 && (
          <Card
            title={`Foods to Add (${foodsToAdd.length})`}
            size="small"
            style={{
              marginBottom: 16,
              background: "#f6ffed",
              borderColor: "#52c41a",
            }}
          >
            <List
              dataSource={foodsToAdd}
              renderItem={(food) => (
                <List.Item
                  actions={[
                    <Button
                      key="delete"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveFromList(food.id)}
                    >
                      Remove
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={food.name}
                    description={`${food.calories} calories`}
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
        <Tabs
          activeKey={foodEntryMode}
          onChange={(key) => {
            setFoodEntryMode(key as "preset" | "custom");
            if (key === "custom") {
              setSelectedFood(null);
              setQuantity("");
              setUnit("grams");
              setCalculatedCalories(0);
            }
          }}
          size="large"
        >
          <TabPane tab="🍏 Preset Foods" key="preset">
            {foodEntryMode === "preset" && (
              <div>
                {selectedFood && (
                  <Card
                    size="small"
                    title={`Selected: ${selectedFood.name}`}
                    style={{ marginBottom: 16, background: "#f6ffed" }}
                  >
                    <Row gutter={16}>
                      <Col span={8}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: 8,
                            fontWeight: 500,
                          }}
                        >
                          Quantity
                        </label>
                        <InputNumber
                          ref={quantityInputRef}
                          style={{ width: "100%" }}
                          placeholder="e.g. 1, 150"
                          value={quantity ? parseFloat(quantity) : null}
                          onChange={(val) => setQuantity(val?.toString() || "")}
                          min={0}
                          step={0.1}
                          size="large"
                        />
                      </Col>
                      <Col span={8}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: 8,
                            fontWeight: 500,
                          }}
                        >
                          Unit
                        </label>
                        <Select
                          style={{ width: "100%" }}
                          value={unit}
                          onChange={(val) => setUnit(val)}
                          size="large"
                        >
                          <Select.Option value="grams">Grams</Select.Option>
                          <Select.Option value="pieces">Pieces</Select.Option>
                          <Select.Option value="ml">
                            Milliliters (ml)
                          </Select.Option>
                        </Select>
                      </Col>
                      <Col span={8}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: 8,
                            fontWeight: 500,
                          }}
                        >
                          Calculated Calories
                        </label>
                        <div
                          style={{
                            padding: "8px 12px",
                            background: "#52c41a",
                            color: "white",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: 600,
                            textAlign: "center",
                            height: "40px",
                            lineHeight: "24px",
                          }}
                        >
                          {calculatedCalories} cal
                        </div>
                      </Col>
                    </Row>
                  </Card>
                )}
                <div>
                  {Object.entries(foodsByCategory).map(([category, foods]) => {
                    const categoryColors: Record<
                      string,
                      { bg: string; border: string }
                    > = {
                      protein: { bg: "#fff1f0", border: "#ffa39e" },
                      carbs: { bg: "#fff7e6", border: "#ffd591" },
                      vegetables: { bg: "#f6ffed", border: "#b7eb8f" },
                      fruits: { bg: "#fff0f6", border: "#ffadd2" },
                      dairy: { bg: "#e6f4ff", border: "#91caff" },
                      snacks: { bg: "#fcffe6", border: "#eaff8f" },
                      drinks: { bg: "#f9f0ff", border: "#d3adf7" },
                    };

                    const colors = categoryColors[category] || {
                      bg: "#fafafa",
                      border: "#d9d9d9",
                    };

                    return (
                      <Card
                        key={category}
                        size="small"
                        title={
                          FOOD_CATEGORIES[
                            category as keyof typeof FOOD_CATEGORIES
                          ].name
                        }
                        style={{
                          marginBottom: 16,
                          background: colors.bg,
                          borderColor: colors.border,
                          borderWidth: 2,
                        }}
                      >
                        <Row gutter={[8, 8]}>
                          {foods.map((food) => (
                            <Col key={food.id} xs={12} sm={8} md={6} lg={4}>
                              <Card
                                size="small"
                                hoverable
                                onClick={() => setSelectedFood(food)}
                                style={{
                                  background:
                                    selectedFood?.id === food.id
                                      ? "#d9f7be"
                                      : "#fff",
                                  borderColor:
                                    selectedFood?.id === food.id
                                      ? "#52c41a"
                                      : "#d9d9d9",
                                  borderWidth:
                                    selectedFood?.id === food.id ? 2 : 1,
                                }}
                              >
                                <div
                                  style={{ fontSize: "13px", fontWeight: 500 }}
                                >
                                  {food.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#8c8c8c",
                                    marginTop: 4,
                                  }}
                                >
                                  {food.caloriesPerUnit} cal/{food.unitType}
                                </div>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </TabPane>
          <TabPane tab="✏️ Custom Entry" key="custom">
            {foodEntryMode === "custom" && (
              <Row gutter={16}>
                <Col span={16}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 500,
                    }}
                  >
                    Food Name
                  </label>
                  <Input
                    placeholder="e.g. Homemade pasta, Restaurant meal"
                    value={customFoodName}
                    onChange={(e) => setCustomFoodName(e.target.value)}
                    size="large"
                  />
                </Col>
                <Col span={8}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 500,
                    }}
                  >
                    Calories
                  </label>
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="e.g. 250"
                    value={customCalories ? parseFloat(customCalories) : null}
                    onChange={(val) => setCustomCalories(val?.toString() || "")}
                    min={0}
                    step={1}
                    size="large"
                  />
                </Col>
              </Row>
            )}
          </TabPane>
        </Tabs>
      </div>
    </ModalContainer>
  );
}
