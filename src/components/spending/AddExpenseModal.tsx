"use client";

import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SpendingCategory } from "@/types";
import dayjs from "dayjs";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: {
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => Promise<void>;
  categories: SpendingCategory[];
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  onAddExpense,
  categories,
}: AddExpenseModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await onAddExpense({
        amount: values.amount,
        category: values.category,
        description: values.description || "",
        date: values.date.format("YYYY-MM-DD"),
      });

      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PlusOutlined />
          Add Expense
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Add Expense
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          date: dayjs(),
        }}
      >
        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: "Please enter amount" },
            {
              type: "number",
              min: 0.01,
              message: "Amount must be greater than 0",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="0.00"
            prefix="$"
            precision={2}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            placeholder="Select category"
            size="large"
            options={categories.map((cat) => ({
              value: cat.id,
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
              ),
            }))}
          />
        </Form.Item>

        <Form.Item name="description" label="Description (Optional)">
          <Input.TextArea
            placeholder="Enter description..."
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Please select date" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            format="YYYY-MM-DD"
            disabledDate={(current) =>
              current && current > dayjs().endOf("day")
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
