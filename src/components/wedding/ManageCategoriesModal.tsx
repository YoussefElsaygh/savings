"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Input, Space, Typography } from "antd";
import { DeleteOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import ModalContainer from "@/components/shared/ModalContainer";

const { Text } = Typography;

interface CategoryItem {
  // Original name (null for categories added in this session)
  originalName: string | null;
  name: string;
}

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  getUsageCount: (category: string) => number;
  onSave: (
    categories: string[],
    renames: { from: string; to: string }[]
  ) => Promise<void>;
}

export default function ManageCategoriesModal({
  isOpen,
  onClose,
  categories,
  getUsageCount,
  onSave,
}: ManageCategoriesModalProps) {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Reset the draft each time the modal opens. Intentionally not keyed on
  // `categories`, so a live Firestore update mid-edit doesn't wipe typing.
  useEffect(() => {
    if (isOpen) {
      setItems(categories.map((c) => ({ originalName: c, name: c })));
      setNewName("");
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const hasDuplicate = (list: CategoryItem[]) => {
    const seen = new Set<string>();
    for (const item of list) {
      const key = item.name.trim().toLowerCase();
      if (seen.has(key)) return true;
      seen.add(key);
    }
    return false;
  };

  const handleRename = (index: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, name: value } : item))
    );
  };

  const handleRemove = (index: number) => {
    const item = items[index];
    if (item.originalName) {
      const count = getUsageCount(item.originalName);
      if (count > 0) {
        setError(
          `"${item.originalName}" is used by ${count} expense(s). Change those expenses to another category before removing it.`
        );
        return;
      }
    }
    setError(null);
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    const candidate = [...items, { originalName: null, name }];
    if (hasDuplicate(candidate)) {
      setError(`"${name}" already exists.`);
      return;
    }
    setError(null);
    setItems(candidate);
    setNewName("");
  };

  const handleSave = async () => {
    const cleaned = items.map((item) => ({
      ...item,
      name: item.name.trim(),
    }));

    if (cleaned.some((item) => item.name === "")) {
      setError("Category names cannot be empty.");
      return;
    }
    if (hasDuplicate(cleaned)) {
      setError("Two categories have the same name.");
      return;
    }

    const renames = cleaned
      .filter(
        (item) => item.originalName && item.originalName !== item.name
      )
      .map((item) => ({ from: item.originalName as string, to: item.name }));

    setSaving(true);
    try {
      await onSave(
        cleaned.map((item) => item.name),
        renames
      );
      onClose();
    } catch (err) {
      console.error("Error saving categories:", err);
      setError("Failed to save categories. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SettingOutlined />
          Manage Categories
        </div>
      }
      maxWidth={500}
      heightMode="fit-content"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={saving} onClick={handleSave}>
          Save Categories
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {error && <Alert type="error" message={error} showIcon />}

        {items.map((item, index) => (
          <Space key={index} style={{ width: "100%" }} align="center">
            <Input
              value={item.name}
              onChange={(e) => handleRename(index, e.target.value)}
              maxLength={50}
              style={{ width: 300 }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemove(index)}
              aria-label="Remove category"
            />
          </Space>
        ))}

        {items.length === 0 && (
          <Text type="secondary">No categories yet. Add one below.</Text>
        )}

        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onPressEnter={handleAdd}
            maxLength={50}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add
          </Button>
        </Space.Compact>
      </Space>
    </ModalContainer>
  );
}
