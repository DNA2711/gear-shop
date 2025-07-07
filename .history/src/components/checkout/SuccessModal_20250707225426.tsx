"use client";

import React, { useEffect, useState, useRef } from "react";
import { CheckCircle, Home } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

interface OrderItem {
  product_id: number;
  quantity: number;
}

interface SuccessModalProps {
  isOpen: boolean;
  orderId: string;
  amount: number;
  orderItems?: OrderItem[];
  onClose?: () => void;
}

export default function SuccessModal({
  isOpen,
  orderId,
  amount,
  orderItems = [],
  onClose,
}: SuccessModalProps) {
  const { removeOrderedItems } = useCart();
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);
  const hasExecuted = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && !hasExecuted.current) {
      console.log("🎯 SuccessModal: Starting countdown from 15 seconds");
      hasExecuted.current = true;

      // Remove only ordered items from cart
      if (orderItems.length > 0) {
        console.log("🛒 SuccessModal: Removing ordered items from cart:", orderItems);
        removeOrderedItems(orderItems);
      }

      // Reset countdown to 15
      setCountdown(15);

      // Start countdown
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          console.log(`⏰ SuccessModal: Countdown: ${prev}`);
          if (prev <= 1) {
            console.log("🏠 SuccessModal: Countdown finished, redirecting to homepage");
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        console.log("🧹 SuccessModal: Cleaning up interval");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen, orderItems, removeOrderedItems, router]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      console.log("🚪 SuccessModal: Modal closed, resetting state");
      hasExecuted.current = false;
      setCountdown(15);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isOpen]);

  const handleGoHome = () => {
    console.log("🏠 SuccessModal: Manual redirect to homepage");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    router.push("/");
  };

  // Format amount properly without decimals
  const formatAmount = (amount: number): string => {
    return Math.floor(amount).toLocaleString("vi-VN");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center animate-in fade-in-0 zoom-in-95 duration-300 border border-gray-200">
        {/* Success Animation */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🎉 Thanh toán thành công!
        </h1>

        <p className="text-gray-600 mb-6">
          Đơn hàng #{orderId} của bạn đã được thanh toán thành công với số tiền{" "}
          <span className="font-semibold text-green-600">
            {formatAmount(amount)} VNĐ
          </span>
        </p>

        {/* Order Info */}
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <div className="text-sm text-green-800">
            ✅ Thanh toán hoàn tất
            <br />
            📦 Đơn hàng sẽ được xử lý trong 1-2 ngày làm việc
            <br />
            🛒 Đã cập nhật giỏ hàng
          </div>
        </div>

        {/* Countdown - Made more prominent */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3">
            Tự động chuyển về trang chủ trong
          </p>
          <div className="text-3xl font-bold text-blue-600 bg-blue-50 rounded-xl py-4 px-6 inline-block border-2 border-blue-200 animate-pulse">
            {countdown} giây
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGoHome}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Về trang chủ ngay
        </button>
      </div>
    </div>
  );
}
