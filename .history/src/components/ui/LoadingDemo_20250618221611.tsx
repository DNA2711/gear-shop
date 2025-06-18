"use client";

import { useApi } from "@/hooks/useApi";
import { useLoading } from "@/contexts/LoadingContext";

export function LoadingDemo() {
  const api = useApi();
  const { withLoading } = useLoading();

  const testApiCall = async () => {
    try {
      await api.get("/api/products?limit=5", {
        loadingMessage: "Đang test API call..."
      });
    } catch (error) {
      console.error("Test error:", error);
    }
  };

  const testManualLoading = async () => {
    await withLoading(
      async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
      },
      "Đang test manual loading..."
    );
  };

  const testMultipleLoading = async () => {
    // Test multiple concurrent API calls
    try {
      await Promise.all([
        api.get("/api/products?limit=3", { loadingMessage: "Đang tải sản phẩm..." }),
        api.get("/api/categories", { loadingMessage: "Đang tải danh mục..." }),
        api.get("/api/brands", { loadingMessage: "Đang tải thương hiệu..." })
      ]);
    } catch (error) {
      console.error("Multiple test error:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md">
      <h3 className="text-lg font-semibold mb-4">Test Hệ Thống Loading</h3>
      <div className="space-y-3">
        <button
          onClick={testApiCall}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Test API Call với Loading
        </button>
        
        <button
          onClick={testManualLoading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Test Manual Loading
        </button>
        
        <button
          onClick={testMultipleLoading}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Test Multiple API Calls
        </button>
      </div>
    </div>
  );
} 