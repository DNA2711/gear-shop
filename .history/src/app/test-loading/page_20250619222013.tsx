"use client";

import { LoadingDemo } from "@/components/ui/LoadingDemo";
import { useApi } from "@/hooks/useApi";
import { useLoading } from "@/contexts/LoadingContext";
import Link from "next/link";
import { LoadingLink } from "@/components/ui/LoadingLink";

export default function TestLoadingPage() {
  const api = useApi();
  const { withLoading, showLoading, hideLoading } = useLoading();

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

  const testInstantLoading = () => {
    console.log("🧪 Testing instant loading...");
    showLoading("Test instant loading - 3 giây");
    setTimeout(() => {
      hideLoading();
      console.log("✅ Instant loading test completed");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🧪 Test Loading System
          </h1>
          <p className="text-lg text-gray-600">
            Test các loại loading để đảm bảo hệ thống hoạt động đúng
          </p>
        </div>

        {/* Quick Test Button */}
        <div className="bg-yellow-100 p-6 rounded-lg shadow-lg mb-8 border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">
            🚀 Quick Test - Instant Loading
          </h2>
          <button
            onClick={testInstantLoading}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
          >
            Test Instant Loading (3s)
          </button>
          <p className="text-sm text-yellow-700 mt-2">
            Click để test loading overlay hiện ngay lập tức
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Loading Tests */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Test API Loading</h2>
            <div className="space-y-3 mb-4">
              <button
                onClick={testFetchProducts}
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🛍️ Test Fetch Products
              </button>

              <button
                onClick={testFetchCategories}
                className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📂 Test Fetch Categories
              </button>

              <button
                onClick={testManualLoading}
                className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                ⏱️ Test Manual Loading (3s)
              </button>
            </div>
          </div>

          {/* Instant Loading Tests */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Test Instant Loading</h2>
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

              <LoadingLink
                href="/pc-builder"
                loadingMessage="Đang mở PC Builder..."
                className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                🚀 Go to PC Builder (Instant Loading)
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
        <div className="flex justify-center mt-8">
          <LoadingDemo />
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            📋 Hướng dẫn Test
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">1️⃣</span>
              Click "Test Instant Loading" để test loading overlay
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">2️⃣</span>
              Click các button API để test loading với real API calls
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">3️⃣</span>
              Click LoadingLink để test instant navigation loading
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">4️⃣</span>
              So sánh với Link thường để thấy sự khác biệt
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">5️⃣</span>
              Mở Developer Console để xem debug logs
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
