"use client";

import React, { useEffect, useRef } from "react";
import { useLoading } from "@/contexts/LoadingContext";

export const GlobalLoadingOverlay = () => {
  const { isLoading, loadingMessage } = useLoading();
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      const startAnimation = () => {
        const animate = () => {
          animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
      };
      startAnimation();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col items-center min-w-[200px] border border-white/20">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <p className="mt-4 text-gray-700 font-medium text-center">
          {loadingMessage || "Đang xử lý..."}
        </p>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;
