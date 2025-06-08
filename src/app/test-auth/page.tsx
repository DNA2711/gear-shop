"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function TestAuthPage() {
  const { user, isAuthenticated, loading, login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "admin@gearshop.com",
    password: "admin123",
  });
  const [loginResult, setLoginResult] = useState<string>("");

  const handleLogin = async () => {
    try {
      const success = await login(credentials);
      setLoginResult(success ? "Login successful!" : "Login failed!");
    } catch (error) {
      setLoginResult(`Login error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test Authentication</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auth Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Auth Status</h2>
          <div className="space-y-2">
            <p>
              <strong>Loading:</strong> {loading ? "Yes" : "No"}
            </p>
            <p>
              <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
            </p>
            <p>
              <strong>User:</strong>{" "}
              {user ? JSON.stringify(user, null, 2) : "None"}
            </p>
          </div>
        </div>

        {/* Login Test */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Login Test</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Password:
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Test Login
            </button>
            {loginResult && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <strong>Result:</strong> {loginResult}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Token Info */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Token Info</h2>
        <div className="space-y-2">
          <p>
            <strong>Access Token:</strong>{" "}
            {localStorage.getItem("accessToken") || "None"}
          </p>
          <p>
            <strong>Refresh Token:</strong>{" "}
            {localStorage.getItem("refreshToken") || "None"}
          </p>
        </div>
      </div>

      {/* API Test */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">API Test</h2>
        <button
          onClick={async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
              try {
                const response = await fetch("/api/auth/me", {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                const data = await response.json();
                console.log("API /me response:", data);
                alert(`API Response: ${JSON.stringify(data, null, 2)}`);
              } catch (error) {
                console.error("API error:", error);
                alert(`API Error: ${error}`);
              }
            } else {
              alert("No token available");
            }
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test /api/auth/me
        </button>
      </div>
    </div>
  );
}
