"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-card transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-accent focus:ring-offset-1 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variantStyles = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary-hover border border-border-strong shadow-gallery active:scale-[0.99]",
      secondary:
        "bg-surface-elevated text-text hover:bg-surface border border-border-subtle active:scale-[0.99]",
      outline:
        "border border-border-subtle bg-transparent text-text hover:bg-surface-elevated hover:border-border-strong active:scale-[0.99]",
      ghost:
        "text-text hover:bg-surface-elevated",
      danger:
        "bg-destructive text-white hover:bg-destructive-hover border border-destructive/20 shadow-sm active:scale-[0.99]",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-2.5 min-h-[44px] gap-1.5 rounded-gallery",
      md: "text-xs uppercase tracking-wider font-semibold px-4 py-3 min-h-[44px] gap-2 rounded-card",
      lg: "text-sm uppercase tracking-wider font-semibold px-6 py-3.5 min-h-[48px] gap-2.5 rounded-card",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
