"use client";

import { ReactNode, useEffect } from "react";
import { Modal, Button } from "antd";
import type { ModalProps } from "antd";

interface ModalContainerProps extends Omit<ModalProps, "footer" | "styles"> {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode[];
  maxWidth?: number;
  heightMode?: "full" | "fit-content";
  compactPadding?: boolean;
  className?: string;
  cancelText?: string;
  okText?: string;
  onOk?: () => void;
  okButtonProps?: {
    loading?: boolean;
    disabled?: boolean;
    type?: "primary" | "default" | "dashed" | "link" | "text";
    danger?: boolean;
    icon?: ReactNode;
  };
  showFooter?: boolean;
}

export default function ModalContainer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 600,
  heightMode = "fit-content",
  compactPadding = false,
  className = "",
  cancelText = "Cancel",
  okText = "OK",
  onOk,
  okButtonProps = {},
  showFooter = true,
  ...rest
}: ModalContainerProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save original overflow value
      const originalOverflow = document.body.style.overflow;
      // Disable body scroll
      document.body.style.overflow = "hidden";

      // Cleanup: restore original overflow when modal closes
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);
  // Default footer if not provided and showFooter is true
  const defaultFooter = footer
    ? footer
    : showFooter
    ? [
        <Button key="cancel" onClick={onClose}>
          {cancelText}
        </Button>,
        onOk && (
          <Button
            key="ok"
            type={okButtonProps.type || "primary"}
            onClick={onOk}
            loading={okButtonProps.loading}
            disabled={okButtonProps.disabled}
            danger={okButtonProps.danger}
            icon={okButtonProps.icon}
          >
            {okText}
          </Button>
        ),
      ].filter(Boolean)
    : null;

  const isFullHeight = heightMode === "full";
  const isFitContent = heightMode === "fit-content";

  // Build styles internally
  const modalStyles = {
    body: {
      padding: compactPadding ? "12px" : "24px",
      ...(isFullHeight && {
        height: "calc(100vh - 55px - 53px)",
        overflowY: "auto" as const,
      }),
    },
    content: {
      borderRadius: 0,
      ...(isFullHeight && {
        height: "100vh",
        display: "flex" as const,
        flexDirection: "column" as const,
      }),
    },
  };

  // Apply responsive className for fit-content mode
  const modalClassName = `${className} ${
    isFitContent ? "modal-fit-content" : ""
  }`.trim();

  return (
    <>
      <style jsx global>{`
        /* Full height modals - always full viewport */

        /* Fit content modals - responsive behavior */
        /* Mobile: full height */
        @media (max-width: 767px) {
          .modal-fit-content .ant-modal {
            height: 100vh !important;
            max-width: 100% !important;
            margin: 0 !important;
            top: 0 !important;
          }

          .modal-fit-content .ant-modal-content {
            height: 100vh !important;
            display: flex !important;
            flex-direction: column !important;
            border-radius: 0 !important;
          }

          .modal-fit-content .ant-modal-body {
            flex: 1 !important;
            overflow-y: auto !important;
          }
        }

        /* Desktop: centered vertically */
        @media (min-width: 768px) {
          .modal-fit-content .ant-modal {
            top: 50% !important;
            transform: translateY(-50%) !important;
            padding-bottom: 0 !important;
          }

          .modal-fit-content .ant-modal-content {
            border-radius: 8px !important;
            top: 25vh;
          }
        }
      `}</style>
      <Modal
        open={isOpen}
        onCancel={onClose}
        title={title}
        width="100%"
        style={{
          top: 0,
          maxWidth: maxWidth,
          margin: "0 auto",
          paddingBottom: 0,
          ...(isFullHeight && { height: "100vh" }),
        }}
        styles={modalStyles}
        className={modalClassName}
        footer={defaultFooter}
        {...rest}
      >
        {children}
      </Modal>
    </>
  );
}
