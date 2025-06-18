"use client";

import { useEffect } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { usePathname } from "next/navigation";

export function useInstantLoading() {
  const { showLoading, hideLoading } = useLoading();
  const pathname = usePathname();

  useEffect(() => {
    // Hide loading when route actually changes
    hideLoading();
  }, [pathname, hideLoading]);

  // Function to show loading immediately when link is clicked
  const showInstantLoading = (message: string = "Đang chuyển trang...") => {
    showLoading(message);
  };

  return { showInstantLoading };
}
