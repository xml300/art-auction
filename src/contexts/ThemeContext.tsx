"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((appliedTheme: ResolvedTheme) => {
    setResolvedTheme(appliedTheme);
    const root = document.documentElement;
    if (appliedTheme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, []);

  const updateTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      if (newTheme === "system") {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      }
    } catch {
      // localStorage may fail in restricted privacy modes
    }

    const nextResolved = newTheme === "system" ? getSystemTheme() : newTheme;
    applyTheme(nextResolved);
  }, [applyTheme]);

  useEffect(() => {
    let savedTheme: Theme = "system";
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        savedTheme = stored;
      }
    } catch {
      // ignore
    }

    setThemeState(savedTheme);
    const initialResolved = savedTheme === "system" ? getSystemTheme() : savedTheme;
    applyTheme(initialResolved);
    setMounted(true);

    // Listen for OS theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      try {
        const currentStored = localStorage.getItem(THEME_STORAGE_KEY);
        if (!currentStored || currentStored === "system") {
          applyTheme(getSystemTheme());
        }
      } catch {
        applyTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    // Listen for storage changes across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY) {
        const nextTheme: Theme =
          e.newValue === "light" || e.newValue === "dark" ? e.newValue : "system";
        setThemeState(nextTheme);
        const nextResolved = nextTheme === "system" ? getSystemTheme() : nextTheme;
        applyTheme(nextResolved);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const next: Theme = resolvedTheme === "dark" ? "light" : "dark";
    updateTheme(next);
  }, [resolvedTheme, updateTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme: updateTheme,
        toggleTheme,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
