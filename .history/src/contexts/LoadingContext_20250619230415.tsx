"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  withLoading: <T>(asyncFn: () => Promise<T>, message?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Đang xử lý...");
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = useCallback(
    (message: string = "Đang xử lý...") => {
      console.log("💫 ShowLoading called:", {
        message,
        currentCount: loadingCount,
      }); // Debug log
      setLoadingCount((prev) => {
        const newCount = prev + 1;
        console.log("📊 Loading count:", newCount); // Debug log
        return newCount;
      });
      setLoadingMessage(message);
      setIsLoading(true);
      console.log("✅ Loading state set to true"); // Debug log
    },
    [loadingCount]
  );

  const hideLoading = useCallback(() => {
    console.log("🔄 HideLoading called, current count:", loadingCount); // Debug log
    setLoadingCount((prev) => {
      const newCount = Math.max(0, prev - 1);
      console.log("📉 Loading count decreased:", newCount); // Debug log
      if (newCount === 0) {
        setIsLoading(false);
        console.log("❌ Loading state set to false"); // Debug log
      }
      return newCount;
    });
  }, [loadingCount]);

  const withLoading = useCallback(
    async <T,>(
      asyncFn: () => Promise<T>,
      message: string = "Đang xử lý..."
    ): Promise<T> => {
      showLoading(message);
      try {
        const result = await asyncFn();
        return result;
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingMessage,
        showLoading,
        hideLoading,
        withLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
