"use client";

import { useEffect } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { setLoadingContext, api } from "@/lib/apiWrapper";

export function useApi() {
  const loadingContext = useLoading();

  useEffect(() => {
    // Set global loading context
    setLoadingContext(loadingContext);
  }, [loadingContext]);

  return api;
} 