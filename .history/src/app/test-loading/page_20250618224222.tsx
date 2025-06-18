"use client";

import { LoadingDemo } from "@/components/ui/LoadingDemo";
import { useApi } from "@/hooks/useApi";
import { useLoading } from "@/contexts/LoadingContext";
import Link from "next/link";
import { LoadingLink } from "@/components/ui/LoadingLink";

export default function TestLoadingPage() {
  const api = useApi();
  const { withLoading } = useLoading();

  const testFetchProducts = async () => {
    try {
      const result = await api.get("/api/products?limit=5", {
        loadingMessage: "Đang tải sản phẩm...",
      });
      console.log("Products:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const testFetchCategories = async () => {
    try {
      const result = await api.get("/api/categories", {
        loadingMessage: "Đang tải danh mục...",
      });
      console.log("Categories:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const testManualLoading = async () => {
    await withLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Manual loading test completed");
    }, "Test manual loading trong 3 giây...");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Test Hệ Thống Loading
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* API Tests */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Test API Calls</h2>
            <div className="space-y-3">
              <button
                onClick={testFetchProducts}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test Fetch Products
              </button>

              <button
                onClick={testFetchCategories}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Test Fetch Categories
              </button>

              <button
                onClick={testManualLoading}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Test Manual Loading (3s)
              </button>
            </div>
          </div>

          {/* Navigation Tests */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Test Instant Loading
            </h2>
            <div className="space-y-3 mb-4">
              <LoadingLink
                href="/admin"
                loadingMessage="Đang chuyển tới Admin..."
                className="block w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-center"
              >
                🚀 Go to Admin (Instant Loading)
              </LoadingLink>

              <LoadingLink
                href="/"
                loadingMessage="Đang chuyển về Trang chủ..."
                className="block w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-center"
              >
                🚀 Go to Home (Instant Loading)
              </LoadingLink>

              <LoadingLink
                href="/products"
                loadingMessage="Đang chuyển tới Sản phẩm..."
                className="block w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center"
              >
                🚀 Go to Products (Instant Loading)
              </LoadingLink>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">So sánh với Link thường:</h3>
              <Link 
                href="/admin/products"
                className="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                🐌 Go to Admin Products (No Loading)
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Component */}
        <div className="flex justify-center">
          <LoadingDemo />
        </div>

        {/* Instructions */}
        <div className="bg-gray-100 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold mb-3">Hướng Dẫn Test:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>API Loading:</strong> Click các button ở trên để test
              loading khi gọi API
            </li>
            <li>
              <strong>Navigation Loading:</strong> Click các link để test
              loading khi chuyển trang
            </li>
            <li>
              <strong>Trong Admin:</strong> Chuyển giữa các tab admin để thấy
              navigation loading
            </li>
            <li>
              <strong>Console:</strong> Mở DevTools để xem kết quả API calls
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
