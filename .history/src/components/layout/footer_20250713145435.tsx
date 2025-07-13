"use client";

import { LoadingLink } from "@/components/ui/LoadingLink";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Smartphone,
  Headphones,
  Shield,
  Truck,
} from "lucide-react";
import {
  PiFacebookLogo,
  PiInstagramLogo,
  PiTiktokLogo,
  PiYoutubeLogo,
} from "react-icons/pi";
import { useAuth } from "@/contexts/AuthContext";

export default function Footer() {
  const { isAuthenticated } = useAuth();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-12">
          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                GearHub
              </h3>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-center sm:justify-start space-x-3 text-gray-300 text-sm sm:text-base">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                <span className="text-center sm:text-left">
                  175 Tây Sơn Phường Kim Liên, TP.Hà Nội
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start space-x-3 text-gray-300 text-sm sm:text-base">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                <span>0359.746.693</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start space-x-3 text-gray-300 text-sm sm:text-base">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                <span>info@gearshop.vn</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start space-x-3 text-gray-300 text-sm sm:text-base">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                <span className="text-center sm:text-left">
                  8:00 - 22:00 (Thứ 2 - Chủ nhật)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Liên kết nhanh
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              <LoadingLink
                href="/products"
                loadingMessage="Đang tải sản phẩm..."
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base py-1"
              >
                Sản phẩm
              </LoadingLink>
              <LoadingLink
                href="/products?category=all"
                loadingMessage="Đang tải danh mục..."
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base py-1"
              >
                Danh mục
              </LoadingLink>
              <LoadingLink
                href="/pc-builder"
                loadingMessage="Đang tải PC Builder..."
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base py-1"
              >
                PC Builder
              </LoadingLink>
              <LoadingLink
                href="/cart"
                loadingMessage="Đang tải giỏ hàng..."
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base py-1"
              >
                Giỏ hàng
              </LoadingLink>
              <LoadingLink
                href="/orders"
                loadingMessage="Đang tải đơn hàng..."
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base py-1"
              >
                Đơn hàng
              </LoadingLink>
              <LoadingLink
                href="/profile"
                loadingMessage="Đang tải hồ sơ..."
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base py-1"
              >
                Tài khoản
              </LoadingLink>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Hỗ trợ khách hàng
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              <LoadingLink
                href="/profile"
                loadingMessage="Đang tải hồ sơ..."
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base py-1"
              >
                Thông tin tài khoản
              </LoadingLink>
              <LoadingLink
                href="/orders"
                loadingMessage="Đang tải đơn hàng..."
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base py-1"
              >
                Theo dõi đơn hàng
              </LoadingLink>
              <LoadingLink
                href="/cart"
                loadingMessage="Đang tải giỏ hàng..."
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base py-1"
              >
                Giỏ hàng của tôi
              </LoadingLink>
              <LoadingLink
                href="/checkout"
                loadingMessage="Đang tải thanh toán..."
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base py-1"
              >
                Thanh toán
              </LoadingLink>
              <LoadingLink
                href="/settings"
                loadingMessage="Đang tải cài đặt..."
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base py-1"
              >
                Cài đặt tài khoản
              </LoadingLink>
              <LoadingLink
                href="/notifications"
                loadingMessage="Đang tải thông báo..."
                className="block text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base py-1"
              >
                Thông báo
              </LoadingLink>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Tại sao chọn GearShop?
            </h4>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center sm:justify-start space-x-3">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">
                  Hàng chính hãng 100%
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start space-x-3">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">
                  Giao hàng toàn quốc
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start space-x-3">
                <Headphones className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">
                  Hỗ trợ 24/7
                </span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h5 className="text-base sm:text-lg font-semibold text-white">
                Theo dõi chúng tôi
              </h5>
              <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4">
                <LoadingLink
                  href="https://facebook.com/gearshop"
                  loadingMessage="Đang tải trang Facebook..."
                  className="p-2 sm:p-2.5 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors transform hover:scale-110 duration-200"
                >
                  <PiFacebookLogo className="w-4 h-4 sm:w-5 sm:h-5" />
                </LoadingLink>

                <LoadingLink
                  href="https://instagram.com/gearshop"
                  loadingMessage="Đang tải trang Instagram..."
                  className="p-2 sm:p-2.5 bg-gray-800 rounded-lg hover:bg-pink-600 transition-colors transform hover:scale-110 duration-200"
                >
                  <PiInstagramLogo className="w-4 h-4 sm:w-5 sm:h-5" />
                </LoadingLink>

                <LoadingLink
                  href="https://youtube.com/gearshop"
                  loadingMessage="Đang tải trang YouTube..."
                  className="p-2 sm:p-2.5 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors transform hover:scale-110 duration-200"
                >
                  <PiYoutubeLogo className="w-4 h-4 sm:w-5 sm:h-5" />
                </LoadingLink>

                <LoadingLink
                  href="https://tiktok.com/@gearshop"
                  loadingMessage="Đang tải trang TikTok..."
                  className="p-2 sm:p-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors transform hover:scale-110 duration-200"
                >
                  <PiTiktokLogo className="w-4 h-4 sm:w-5 sm:h-5" />
                </LoadingLink>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0 text-center md:text-left">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">
                © 2025 GearHub. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Công ty TNHH Công Nghệ GearHub | Mã số thuế: 001212519
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end space-x-4 sm:space-x-6 text-xs sm:text-sm">
              <LoadingLink
                href="/terms"
                loadingMessage="Đang tải điều khoản sử dụng..."
                className="text-gray-400 hover:text-blue-400 transition-colors whitespace-nowrap"
              >
                Điều khoản sử dụng
              </LoadingLink>
              <LoadingLink
                href="/privacy"
                loadingMessage="Đang tải chính sách bảo mật..."
                className="text-gray-400 hover:text-blue-400 transition-colors whitespace-nowrap"
              >
                Chính sách bảo mật
              </LoadingLink>
              <LoadingLink
                href="/sitemap"
                loadingMessage="Đang tải sơ đồ trang web..."
                className="text-gray-400 hover:text-blue-400 transition-colors whitespace-nowrap"
              >
                Sơ đồ trang web
              </LoadingLink>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-800/50">
            <div className="text-center">
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                <span className="inline-block mr-2">🚀</span>
                Cung cấp thiết bị công nghệ chất lượng cao cho game thủ và
                chuyên gia IT tại Việt Nam
              </p>
              <div className="flex justify-center items-center mt-3 space-x-4 text-xs text-gray-600">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Hệ thống hoạt động 24/7
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Giao hàng toàn quốc
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Bảo hành chính hãng
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
