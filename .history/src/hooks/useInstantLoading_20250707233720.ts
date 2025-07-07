"use client";

import { useEffect } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { usePathname } from "next/navigation";

export function useInstantLoading() {
  const { showLoading, hideLoading } = useLoading();
  const pathname = usePathname();

  useEffect(() => {
    hideLoading();
  }, [pathname, hideLoading]);

  const showInstantLoading = (message: string = "Đang chuyển trang...") => {
    showLoading(message);
  };

  return { showInstantLoading };
}
