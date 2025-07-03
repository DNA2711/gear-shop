"use client";

import React from "react";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Đặt hàng thành công!
          </h1>

          <p className="text-gray-600 mb-8">
            Cảm ơn bạn đã đặt hàng. Chúng tôi đã gửi thông tin đơn hàng đến
            email của bạn. Vui lòng kiểm tra email để biết thêm chi tiết về đơn
            hàng và hướng dẫn thanh toán.
          </p>

          <div className="space-y-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Tiếp tục mua sắm
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Về trang chủ
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin thanh toán
            </h2>
            <div className="bg-blue-50 rounded-xl p-4 text-left">
              <p className="text-sm text-blue-900">
                <strong>Ngân hàng:</strong> Vietcombank
                <br />
                <strong>Số tài khoản:</strong> 1234567890
                <br />
                <strong>Chủ tài khoản:</strong> CÔNG TY TNHH GEAR SHOP
                <br />
                <strong>Chi nhánh:</strong> Hồ Chí Minh
                <br />
                <strong>Nội dung chuyển khoản:</strong> [Mã đơn hàng của bạn]
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Vui lòng chuyển khoản trong vòng 24 giờ để đảm bảo đơn hàng được
              xử lý nhanh chóng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
