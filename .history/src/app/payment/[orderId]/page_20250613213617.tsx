"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage({
  params,
}: {
  params: { orderId: string };
}) {
  const router = useRouter();

  useEffect(() => {
    // Giả lập quá trình thanh toán
    const timer = setTimeout(() => {
      // Chuyển hướng đến trang thành công sau 2 giây
      router.push(`/checkout/success?orderId=${params.orderId}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [params.orderId, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Đang xử lý thanh toán
        </h1>
        <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
      </div>
    </div>
  );
}
