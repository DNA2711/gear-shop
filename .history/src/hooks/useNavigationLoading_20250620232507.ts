"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

export function useNavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showLoading, hideLoading } = useLoading();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip loading on first load
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      hideLoading();
    }

    // Show loading when navigation starts
    setIsNavigating(true);
    showLoading("Đang chuyển trang...");

    // Set a timeout to hide loading after minimum duration
    timeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      hideLoading();
      timeoutRef.current = null;
    }, 800);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        hideLoading();
        setIsNavigating(false);
        timeoutRef.current = null;
      }
    };
  }, [pathname, searchParams]);

  return { isNavigating };
}
