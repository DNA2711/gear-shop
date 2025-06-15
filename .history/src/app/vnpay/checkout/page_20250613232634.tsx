"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function VNPayCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [orderId, setOrderId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const orderParam = searchParams.get("order");
    const amountParam = searchParams.get("amount");
    
    if (orderParam) setOrderId(orderParam);
    if (amountParam) setAmount(parseInt(amountParam));

    // Auto-process payment after a short delay
    const processTimer = setTimeout(() => {
      setIsProcessing(true);
      
      // Countdown timer for redirect
      const redirectTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(redirectTimer);
            router.push("/checkout/success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(redirectTimer);
    }, 1500);

    return () => clearTimeout(processTimer);
  }, [searchParams, router]);

  if (!isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VNPay Gateway</h1>
                <p className="text-sm text-gray-600">Cổng thanh toán trực tuyến</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Loading Animation */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              🔄 Đang xử lý thanh toán
            </h2>
            
            <p className="text-gray-600 mb-6">
              Vui lòng đợi trong giây lát, hệ thống đang xác thực giao dịch...
            </p>

            {/* Order Details Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-left">
                  <p className="text-sm text-blue-600 font-medium">Mã đơn hàng</p>
                  <p className="text-lg font-bold text-blue-900 font-mono">{orderId}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-blue-600 font-medium">Số tiền</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {amount.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Bảo mật SSL</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Mã hóa 256-bit</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Xác thực 3D</span>
              </div>
            </div>

            {/* Loading Progress */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>

            <p className="text-xs text-gray-500">
              Powered by VNPay • Ngân hàng Quốc gia Việt Nam
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">VNPay Gateway</h1>
              <p className="text-sm text-gray-600">Giao dịch thành công</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2">🎉 Thanh toán thành công!</h2>
            <p className="text-green-100">Giao dịch của bạn đã được xử lý thành công</p>
          </div>

          {/* Transaction Details */}
          <div className="p-8">
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Chi tiết giao dịch
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
                  <p className="font-mono font-bold text-gray-900 bg-white px-3 py-2 rounded border">
                    {orderId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Số tiền thanh toán</p>
                  <p className="font-bold text-xl text-green-600 bg-green-50 px-3 py-2 rounded border border-green-200">
                    {amount.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Thời gian</p>
                  <p className="font-semibold text-gray-900 bg-white px-3 py-2 rounded border">
                    {new Date().toLocaleString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phương thức</p>
                  <p className="font-semibold text-gray-900 bg-white px-3 py-2 rounded border flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    VNPay QR Code
                  </p>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3 bg-green-50 px-6 py-3 rounded-full border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-semibold">Giao dịch hoàn tất</span>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Redirect Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-blue-700 font-medium">
                  Tự động chuyển hướng sau {countdown} giây
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => router.push("/checkout/success")}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🛒 Tiếp tục mua sắm →
            </button>

            {/* Footer Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span>🔒 Bảo mật SSL</span>
                <span>•</span>
                <span>📱 Hỗ trợ mobile</span>
                <span>•</span>
                <span>⚡ Xử lý tức thời</span>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                © 2024 VNPay Gateway. Cảm ơn bạn đã sử dụng dịch vụ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 