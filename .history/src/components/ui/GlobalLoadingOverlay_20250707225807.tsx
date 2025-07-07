"use client";

import { useLoading } from "@/contexts/LoadingContext";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export function GlobalLoadingOverlay() {
  const { isLoading, loadingMessage } = useLoading();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log("🎭 GlobalLoadingOverlay isLoading changed:", isLoading); // Debug log

    if (isLoading) {
      console.log("🚀 Starting loading animation..."); // Debug log
      setProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 10;
        });
      }, 50);

      // Complete progress after some time
      const completeTimer = setTimeout(() => {
        setProgress(100);
      }, 600);

      return () => {
        console.log("🛑 Cleanup loading animation"); // Debug log
        clearInterval(progressInterval);
        clearTimeout(completeTimer);
      };
    }
  }, [isLoading]);

  console.log("🎭 GlobalLoadingOverlay render:", { isLoading, loadingMessage }); // Debug log

  if (!isLoading) {
    console.log("❌ GlobalLoadingOverlay: Not loading, returning null"); // Debug log
    return null;
  }

  console.log("✅ GlobalLoadingOverlay: Rendering overlay"); // Debug log

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/20 via-blue-900/20 to-gray-900/20 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6 animate-scaleIn border border-gray-200/50 max-w-sm mx-4">
        {/* Loading Icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-white" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-ping opacity-25"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {loadingMessage}
          </h3>
          <p className="text-sm text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Progress Text */}
        <p className="text-xs text-gray-500 font-medium">
          {Math.round(progress)}%
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
