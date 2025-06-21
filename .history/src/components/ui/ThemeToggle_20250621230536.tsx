"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, actualTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  const themeOptions = [
    { value: "light", icon: Sun, label: "Sáng" },
    { value: "dark", icon: Moon, label: "Tối" },
    { value: "system", icon: Monitor, label: "Hệ thống" },
  ] as const;

  return (
    <div className="relative group">
      <button
        onClick={() => {
          const currentIndex = themeOptions.findIndex(
            (opt) => opt.value === theme
          );
          const nextIndex = (currentIndex + 1) % themeOptions.length;
          setTheme(themeOptions[nextIndex].value);
        }}
        className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 overflow-hidden"
        title={`Chuyển sang ${themeOptions
          .find((opt) => opt.value === theme)
          ?.label?.toLowerCase()}`}
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Icon container with rotation effect */}
        <div className="relative w-full h-full flex items-center justify-center">
          {theme === "light" && (
            <Sun className="w-6 h-6 text-yellow-500 group-hover:text-yellow-600 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
          )}
          {theme === "dark" && (
            <Moon className="w-6 h-6 text-blue-400 group-hover:text-blue-500 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
          )}
          {theme === "system" && (
            <Monitor className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-all duration-300 group-hover:scale-110" />
          )}
        </div>

        {/* Active indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              theme === "light"
                ? "bg-yellow-500 shadow-lg shadow-yellow-500/50"
                : theme === "dark"
                ? "bg-blue-400 shadow-lg shadow-blue-400/50"
                : "bg-purple-500 shadow-lg shadow-purple-500/50"
            }`}
          ></div>
        </div>
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        <div className="flex items-center space-x-2">
          {theme === "light" && <Sun className="w-4 h-4" />}
          {theme === "dark" && <Moon className="w-4 h-4" />}
          {theme === "system" && <Monitor className="w-4 h-4" />}
          <span>
            {theme === "light" && "Chế độ sáng"}
            {theme === "dark" && "Chế độ tối"}
            {theme === "system" && "Theo hệ thống"}
          </span>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
      </div>
    </div>
  );
}

// Compact version for mobile/small spaces
export function ThemeToggleCompact() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center group"
      title="Chuyển đổi theme"
    >
      {theme === "light" && (
        <Sun className="w-4 h-4 text-yellow-500 group-hover:rotate-12 transition-transform duration-200" />
      )}
      {theme === "dark" && (
        <Moon className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform duration-200" />
      )}
      {theme === "system" && (
        <Monitor className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-200" />
      )}
    </button>
  );
}
