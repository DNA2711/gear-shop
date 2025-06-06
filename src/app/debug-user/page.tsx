"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getUserDisplayName } from "@/utils/userUtils";

export default function DebugUserPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to view user debug info</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">User Debug Information</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Raw User Object</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">User Field Analysis</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong>user?.id:</strong> {user?.id || "undefined"}
              </p>
              <p>
                <strong>user?.email:</strong> {user?.email || "undefined"}
              </p>
              <p>
                <strong>user?.name:</strong> {user?.name || "undefined"}
              </p>
              <p>
                <strong>user?.full_name:</strong>{" "}
                {user?.full_name || "undefined"}
              </p>
              <p>
                <strong>user?.fullName:</strong> {user?.fullName || "undefined"}
              </p>
              <p>
                <strong>user?.username:</strong> {user?.username || "undefined"}
              </p>
              <p>
                <strong>user?.role:</strong> {user?.role || "undefined"}
              </p>
            </div>
            <div>
              <p>
                <strong>getUserDisplayName(user):</strong>{" "}
                {getUserDisplayName(user)}
              </p>
              <p>
                <strong>Direct full_name access:</strong>{" "}
                {user?.full_name || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">All User Properties</h2>
          <div className="space-y-2">
            {user &&
              Object.entries(user).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong>{" "}
                  {typeof value === "string" ? value : JSON.stringify(value)}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
