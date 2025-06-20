"use client";

import { useEffect, useRef } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { usePathname } from "next/navigation";

export function useInstantLoading() {
  const { showLoading, hideLoading } = useLoading();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Hide loading when route actually changes, but with a small delay
    // to ensure the loading has time to show
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      hideLoading();
    }, 100); // Small delay to ensure loading shows

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname, hideLoading]);

  // Function to show loading immediately when link is clicked
  const showInstantLoading = (message: string = "Đang chuyển trang...") => {
    console.log("🚀 ShowInstantLoading called:", message); // Debug log
    showLoading(message);
  };

  return { showInstantLoading };
}
