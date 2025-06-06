import React from "react";

interface LoadingProps {
  message?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

export function Loading({ 
  message = "Đang xử lý...", 
  size = "medium", 
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8", 
    large: "h-12 w-12"
  };

  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="relative">
          <div
            className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mx-auto`}
          ></div>
        </div>
        {message && (
          <p className="mt-3 text-sm text-gray-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
} 