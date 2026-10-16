"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle({
  className,
  switchToggle = false,
}: {
  className?: string;
  switchToggle?: boolean;
}) {
  const { resolvedTheme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={cn("w-9 h-9 rounded-xl border border-border-subtle bg-surface", className)} />
    );
  }

  if (switchToggle) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={resolvedTheme === "dark"}
        aria-label="Toggle dark mode"
        onClick={toggleTheme}
        className={cn(
          "w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 border border-border-subtle",
          resolvedTheme === "dark" ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
        )}
      >
        <span
          className={cn(
            "w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 flex items-center justify-center text-slate-800",
            resolvedTheme === "dark" ? "translate-x-5" : "translate-x-0"
          )}
        >
          {resolvedTheme === "dark" ? <Moon className="w-3 h-3 text-primary" /> : <Sun className="w-3 h-3 text-amber-500" />}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={cn(
        "min-w-[44px] min-h-[44px] p-2.5 rounded-card border border-border-subtle bg-surface text-text hover:bg-surface-elevated transition-colors shadow-gallery active:scale-95 flex items-center justify-center",
        className
      )}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-4 h-4 text-accent" />
      ) : (
        <Moon className="w-4 h-4 text-text-muted" />
      )}
    </button>
  );
}

export function SwitchThemeToggle() {
  return <ThemeToggle switchToggle />;
}
