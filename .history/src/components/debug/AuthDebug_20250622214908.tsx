"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";

export const AuthDebug: React.FC = () => {
  const { user, loading } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white text-xs p-3 rounded-lg z-50 max-w-xs">
      <div className="font-bold mb-2">Auth Debug</div>
      <div>Loading: {loading ? "Yes" : "No"}</div>
      <div>User: {user ? user.full_name || user.email : "Not logged in"}</div>
      <div>Role: {user?.role || "None"}</div>
      <div>
        Token: {localStorage.getItem("accessToken") ? "Present" : "Missing"}
      </div>
      <div>Current URL: {window.location.pathname}</div>
    </div>
  );
};
