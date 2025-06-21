"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  actualTheme: "light" | "dark"; // Theme thực tế được áp dụng
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  // Kiểm tra theme preference từ localStorage khi mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // Áp dụng theme và theo dõi system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const applyTheme = () => {
      const root = document.documentElement;
      let effectiveTheme: "light" | "dark";

      if (theme === "system") {
        effectiveTheme = mediaQuery.matches ? "dark" : "light";
      } else {
        effectiveTheme = theme;
      }

      if (effectiveTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      setActualTheme(effectiveTheme);
    };

    applyTheme();

    // Lắng nghe thay đổi system preference
    if (theme === "system") {
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  // Lưu theme preference vào localStorage
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
} 