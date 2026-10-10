"use client";

import React, { useEffect, useState, useRef } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { Toast, ToastType } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const typeConfig: Record<
  ToastType,
  {
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    badgeText: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    badgeText: "Success",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-rose-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    badgeText: "Error",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    badgeText: "Warning",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    badgeText: "Info",
  },
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const remainingTimeRef = useRef(toast.duration ?? 4000);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (toast.duration === 0) return;

    if (!isHovered) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onDismiss(toast.id);
      }, remainingTimeRef.current);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isHovered, toast.id, toast.duration, onDismiss]);

  const config = typeConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "pointer-events-auto w-full max-w-sm rounded-2xl border bg-surface p-4 shadow-xl transition-all duration-200 animate-slide-in-right",
        "flex items-start gap-3.5 relative overflow-hidden backdrop-blur-md",
        config.borderColor
      )}
    >
      <div className={cn("p-2 rounded-xl shrink-0 mt-0.5", config.bgColor)}>
        <Icon className={cn("w-4 h-4", config.iconColor)} />
      </div>

      <div className="flex-1 min-w-0 pr-6">
        {toast.title ? (
          <h4 className="text-xs font-bold tracking-tight text-text mb-0.5">
            {toast.title}
          </h4>
        ) : null}
        <p className="text-xs text-text-muted leading-relaxed break-words">
          {toast.message}
        </p>

        {toast.action ? (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick();
                onDismiss(toast.id);
              }}
              className="text-xs font-semibold text-primary hover:text-primary-hover underline underline-offset-2 transition-colors"
            >
              {toast.action.label}
            </button>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="absolute top-3.5 right-3.5 p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function ToastContainer({
  toasts,
  onDismiss,
}: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[9999] pointer-events-none flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
