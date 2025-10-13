"use client";

import { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, DatePicker, Button } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { SpendingCategory, Expense } from "@/types";
import dayjs from "dayjs";
import ModalContainer from "@/components/shared/ModalContainer";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: {
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => Promise<void>;
  onEditExpense?: (
    expenseId: string,
    expense: {
      amount: number;
      category: string;
      description: string;
      date: string;
    }
  ) => Promise<void>;
  categories: SpendingCategory[];
  editingExpense?: Expense | null;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  onAddExpense,
  onEditExpense,
  categories,
  editingExpense,
}: AddExpenseModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!editingExpense;

  // Update form when editing expense changes
  useEffect(() => {
    if (isEditMode && editingExpense) {
      form.setFieldsValue({
        amount: editingExpense.amount,
        category: editingExpense.category,
        description: editingExpense.description,
        date: dayjs(editingExpense.date),
      });
    } else {
      form.setFieldsValue({
        date: dayjs(),
      });
    }
  }, [editingExpense, isEditMode, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const expenseData = {
        amount: values.amount,
        category: values.category,
        description: values.description || "",
        date: values.date.format("YYYY-MM-DD"),
      };

      if (isEditMode && editingExpense && onEditExpense) {
        await onEditExpense(editingExpense.id, expenseData);
      } else {
        await onAddExpense(expenseData);
      }

      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error saving expense:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={handleCancel}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isEditMode ? <EditOutlined /> : <PlusOutlined />}
          {isEditMode ? "Edit Expense" : "Add Expense"}
        </div>
      }
      maxWidth={600}
      heightMode="fit-content"
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
          {isEditMode ? "Save Changes" : "Add Expense"}
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
            prefix="EGP"
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
    </ModalContainer>
  );
}
