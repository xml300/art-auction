"use client";

import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({
  className,
  switchToggle = false,
}: {
  className?: string;
  switchToggle?: boolean;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const isDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const resolvedTheme = isDark ? "dark" : "light";
    setTheme(resolvedTheme);
    if (resolvedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

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
        aria-checked={theme === "dark"}
        aria-label="Toggle dark mode"
        onClick={toggleTheme}
        className={cn(
          "w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 border border-border-subtle",
          theme === "dark" ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
        )}
      >
        <span
          className={cn(
            "w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 flex items-center justify-center text-slate-800",
            theme === "dark" ? "translate-x-5" : "translate-x-0"
          )}
        >
          {theme === "dark" ? <Moon className="w-3 h-3 text-primary" /> : <Sun className="w-3 h-3 text-amber-500" />}
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
        "p-2 rounded-xl border border-border-subtle bg-surface text-text hover:bg-surface-elevated transition-colors shadow-xs active:scale-95 flex items-center justify-center",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-text-muted" />
      )}
    </button>
  );
}

export function SwitchThemeToggle() {
  return <ThemeToggle switchToggle />;
}
