"use client";

import { useNavigationLoading } from "@/hooks/useNavigationLoading";

interface NavigationLoadingProviderProps {
  children: React.ReactNode;
}

export function NavigationLoadingProvider({
  children,
}: NavigationLoadingProviderProps) {
  useNavigationLoading();

  return <>{children}</>;
}
