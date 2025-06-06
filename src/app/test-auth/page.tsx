"use client";

import { useState } from "react";
import { API_CONFIG } from "@/config/api";

export default function TestAuthPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (
    test: string,
    result: any,
    status: "success" | "error"
  ) => {
    setTestResults((prev) => [
      ...prev,
      { test, result, status, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const testBackendConnection = async () => {
    setIsLoading(true);
    setTestResults([]);

    // Test 1: Backend connection
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.text();
        addTestResult(
          "Backend Health Check",
          `Status: ${response.status}, Response: ${data}`,
          "success"
        );
      } else {
        addTestResult(
          "Backend Health Check",
          `Status: ${response.status}, Error: ${response.statusText}`,
          "error"
        );
      }
    } catch (error) {
      addTestResult("Backend Health Check", `Error: ${error}`, "error");
    }

    // Test 2: Login endpoint structure
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@test.com",
            password: "wrongpassword",
          }),
        }
      );

      const data = await response.json();
      addTestResult(
        "Login Endpoint Test",
        `Status: ${response.status}, Response: ${JSON.stringify(
          data,
          null,
          2
        )}`,
        response.status === 401 ? "success" : "error"
      );
    } catch (error) {
      addTestResult("Login Endpoint Test", `Error: ${error}`, "error");
    }

    // Test 3: Register endpoint structure
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.SIGNUP}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Test User",
            email: "test@test.com",
            password: "testpass",
            confirmPassword: "testpass",
          }),
        }
      );

      const data = await response.json();
      addTestResult(
        "Register Endpoint Test",
        `Status: ${response.status}, Response: ${JSON.stringify(
          data,
          null,
          2
        )}`,
        "success"
      );
    } catch (error) {
      addTestResult("Register Endpoint Test", `Error: ${error}`, "error");
    }

    setIsLoading(false);
  };

  const testWithRealCredentials = async () => {
    const email = (document.getElementById("testEmail") as HTMLInputElement)
      ?.value;
    const password = (
      document.getElementById("testPassword") as HTMLInputElement
    )?.value;

    if (!email || !password) {
      alert("Vui lòng nhập email và password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      addTestResult(
        "Real Login Test",
        `Status: ${response.status}, Response: ${JSON.stringify(
          data,
          null,
          2
        )}`,
        response.ok ? "success" : "error"
      );
    } catch (error) {
      addTestResult("Real Login Test", `Error: ${error}`, "error");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Backend Authentication Test</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p>
              <strong>Base URL:</strong> {API_CONFIG.BASE_URL}
            </p>
            <p>
              <strong>Login Endpoint:</strong> {API_CONFIG.ENDPOINTS.AUTH.LOGIN}
            </p>
            <p>
              <strong>Register Endpoint:</strong>{" "}
              {API_CONFIG.ENDPOINTS.AUTH.SIGNUP}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Basic Tests</h2>
          <button
            onClick={testBackendConnection}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Testing..." : "Run Basic Tests"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Real Credentials Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              id="testEmail"
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              id="testPassword"
              type="password"
              placeholder="Enter your password"
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            onClick={testWithRealCredentials}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Test Real Login
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Test Results</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded border-l-4 ${
                  result.status === "success"
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{result.test}</h3>
                  <span className="text-sm text-gray-500">
                    {result.timestamp}
                  </span>
                </div>
                <pre className="text-sm whitespace-pre-wrap break-words">
                  {typeof result.result === "string"
                    ? result.result
                    : JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
