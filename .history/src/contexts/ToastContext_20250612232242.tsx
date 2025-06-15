"use client";

import React, { createContext, useContext, useState } from "react";
import { WelcomeToast } from "@/components/ui/WelcomeToast";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showWelcomeToast: (user: { name?: string; email?: string }) => void;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function GeneralToast({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-black";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

    return (
    <div 
      className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] transform transition-all duration-300 ${getToastStyles()}`}
      style={{
        animation: "slideInRight 0.3s ease-out"
      }}
    >
      <span className="text-lg">{getIcon()}</span>
      <span className="flex-1 font-medium">{toast.message}</span>
      <button
        onClick={onClose}
        className="text-lg hover:opacity-70 transition-opacity"
      >
        ×
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [welcomeToast, setWelcomeToast] = useState<{
    user: { name?: string; email?: string };
  } | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showWelcomeToast = (user: { name?: string; email?: string }) => {
    setWelcomeToast({ user });
  };

  const hideWelcomeToast = () => {
    setWelcomeToast(null);
  };

  const showToast = (
    message: string,
    type: ToastType = "info",
    duration: number = 3000
  ) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showWelcomeToast, showToast }}>
      {children}
      {welcomeToast && (
        <WelcomeToast user={welcomeToast.user} onClose={hideWelcomeToast} />
      )}
      {toasts.map((toast) => (
        <GeneralToast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
