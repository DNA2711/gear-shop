"use client";

import { useNavigationLoading } from "@/hooks/useNavigationLoading";

interface NavigationLoadingProviderProps {
  children: React.ReactNode;
}

export function NavigationLoadingProvider({
  children,
}: NavigationLoadingProviderProps) {
  // This hook will automatically handle navigation loading
  useNavigationLoading();

  return <>{children}</>;
}
