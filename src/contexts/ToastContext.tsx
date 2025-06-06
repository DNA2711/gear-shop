"use client";

import React, { createContext, useContext, useState } from "react";
import { WelcomeToast } from "@/components/ui/WelcomeToast";

interface ToastContextType {
  showWelcomeToast: (user: { name?: string; email?: string }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [welcomeToast, setWelcomeToast] = useState<{
    user: { name?: string; email?: string };
  } | null>(null);

  const showWelcomeToast = (user: { name?: string; email?: string }) => {
    setWelcomeToast({ user });
  };

  const hideWelcomeToast = () => {
    setWelcomeToast(null);
  };

  return (
    <ToastContext.Provider value={{ showWelcomeToast }}>
      {children}
      {welcomeToast && (
        <WelcomeToast user={welcomeToast.user} onClose={hideWelcomeToast} />
      )}
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
