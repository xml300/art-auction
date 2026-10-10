"use client";

import { useState, useEffect } from "react";

export default function ThemeSettings() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const isDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const currentTheme = isDark ? "dark" : "light";
    setTheme(currentTheme);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return <div className="p-6 h-24" />;
  }

  return (
    <div className="p-6 space-y-4 text-left">
      <div>
        <label
          htmlFor="theme_select"
          className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"
        >
          Interface Theme
        </label>
        <select
          name="theme_select"
          id="theme_select"
          className="rounded-xl border border-border-subtle bg-surface text-text text-sm py-2 px-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={theme}
          onChange={handleChange}
        >
          <option value="light">Light Theme (Classic Ivory)</option>
          <option value="dark">Dark Theme (Deep Midnight Navy)</option>
        </select>
      </div>
      <p className="text-xs text-text-muted">
        Adjust interface colors to your viewing preference across all platform pages.
      </p>
    </div>
  );
}
