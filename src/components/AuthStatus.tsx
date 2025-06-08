"use client";

import { useAuth } from "@/contexts/AuthContext";
import { safeLocalStorage } from "@/config/api";
import { useEffect, useState } from "react";

export function AuthStatus() {
  const { user, loading, isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Đảm bảo component đã mount trên client
  useEffect(() => {
    setIsClient(true);
    // Chỉ lấy token khi đã ở client
    setToken(safeLocalStorage.getItem("auth-token"));
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null; // Chỉ hiển thị trong development mode
  }

  // Không render gì cho đến khi component đã mount ở client
  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg text-sm max-w-xs z-50">
      <h4 className="font-bold mb-2">Auth Status (Dev)</h4>
      <div className="space-y-1">
        <p>
          <strong>Loading:</strong> {loading ? "Yes" : "No"}
        </p>
        <p>
          <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
        </p>
        <p>
          <strong>Token:</strong> {token ? "Exists" : "None"}
        </p>
        {user && (
          <div>
            <strong>User:</strong>
            <pre className="text-xs mt-1 bg-gray-700 p-2 rounded overflow-auto max-h-20">
              {JSON.stringify(user, null, 1)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
