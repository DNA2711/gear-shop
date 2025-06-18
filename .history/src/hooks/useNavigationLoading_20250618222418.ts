"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

export function useNavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showLoading, hideLoading } = useLoading();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Show loading when navigation starts
    setIsNavigating(true);
    showLoading("Đang chuyển trang...");

    // Set a timeout to hide loading after minimum duration
    const timeout = setTimeout(() => {
      setIsNavigating(false);
      hideLoading();
    }, 500); // Minimum 500ms loading

    return () => {
      clearTimeout(timeout);
      if (isNavigating) {
        hideLoading();
        setIsNavigating(false);
      }
    };
  }, [pathname, searchParams]);

  return { isNavigating };
}
