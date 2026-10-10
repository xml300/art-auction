"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import ToastContainer from "@/components/ui/ToastContainer";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: ToastAction;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (
    options: string | { message: string; title?: string; type?: ToastType; duration?: number; action?: ToastAction },
    type?: ToastType
  ) => string;
  success: (message: string, title?: string, action?: ToastAction) => string;
  error: (message: string, title?: string, action?: ToastAction) => string;
  warning: (message: string, title?: string, action?: ToastAction) => string;
  info: (message: string, title?: string, action?: ToastAction) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const MAX_TOASTS = 4;
const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (
      options: string | { message: string; title?: string; type?: ToastType; duration?: number; action?: ToastAction },
      typeFallback: ToastType = "info"
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: Toast =
        typeof options === "string"
          ? {
              id,
              message: options,
              type: typeFallback,
              duration: DEFAULT_DURATION,
            }
          : {
              id,
              message: options.message,
              title: options.title,
              type: options.type || typeFallback,
              duration: options.duration ?? DEFAULT_DURATION,
              action: options.action,
            };

      setToasts((prev) => {
        const next = [...prev, newToast];
        if (next.length > MAX_TOASTS) {
          return next.slice(next.length - MAX_TOASTS);
        }
        return next;
      });

      return id;
    },
    []
  );

  const success = useCallback(
    (message: string, title?: string, action?: ToastAction) =>
      showToast({ message, title, type: "success", action }, "success"),
    [showToast]
  );

  const error = useCallback(
    (message: string, title?: string, action?: ToastAction) =>
      showToast({ message, title, type: "error", action }, "error"),
    [showToast]
  );

  const warning = useCallback(
    (message: string, title?: string, action?: ToastAction) =>
      showToast({ message, title, type: "warning", action }, "warning"),
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string, action?: ToastAction) =>
      showToast({ message, title, type: "info", action }, "info"),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        success,
        error,
        warning,
        info,
        dismissToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
