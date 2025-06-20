"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

export function useNavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showLoading, hideLoading } = useLoading();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Skip loading on first load
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }

    // Show loading when navigation starts
    setIsNavigating(true);
    showLoading("Đang chuyển trang...");

    // Set a timeout to hide loading after minimum duration (increased)
    const timeout = setTimeout(() => {
      setIsNavigating(false);
      hideLoading();
    }, 800); // Minimum 800ms loading for better UX

    return () => {
      clearTimeout(timeout);
      hideLoading();
      setIsNavigating(false);
    };
    // Only depend on pathname and searchParams since showLoading/hideLoading are memoized
  }, [pathname, searchParams]);

  return { isNavigating };
}
