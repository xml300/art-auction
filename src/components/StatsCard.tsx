"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border-subtle bg-surface p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary/30 flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {title}
        </span>
        {icon && (
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl font-bold tracking-tight text-text">
          {value}
        </div>

        <div className="flex items-center justify-between mt-1 text-xs">
          {subtitle && (
            <span className="text-text-muted">{subtitle}</span>
          )}
          {trend && (
            <span
              className={cn(
                "font-medium inline-flex items-center px-2 py-0.5 rounded-full text-[11px]",
                trend.isPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
