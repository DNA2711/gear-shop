import { LoadingLink } from "@/components/ui/LoadingLink";
import { Mail, Phone, MapPin } from "lucide-react";
import { PiFacebookLogo, PiInstagramLogo } from "react-icons/pi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-8 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="p-1 bg-blue-600 rounded-md">
                <span className="font-bold text-lg">G</span>
              </span>
              <h3 className="text-lg font-bold text-white">GearShop</h3>
            </div>
            <p className="text-gray-300 text-sm leading-snug line-clamp-2">
              Cửa hàng công nghệ, linh kiện & phụ kiện chính hãng.
            </p>
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>123 Nguyễn Văn Cừ, Q.1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>0359.746.693</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>info@gearshop.vn</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white mb-1">Liên kết</h4>
            <div className="space-y-1 text-sm">
              <LoadingLink
                href="/products"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Sản phẩm
              </LoadingLink>
              <LoadingLink
                href="/cart"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Giỏ hàng
              </LoadingLink>
              <LoadingLink
                href="/orders"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Đơn hàng
              </LoadingLink>
              <LoadingLink
                href="/profile"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Tài khoản
              </LoadingLink>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white mb-1">Hỗ trợ</h4>
            <div className="space-y-1 text-sm">
              <LoadingLink
                href="/settings"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Cài đặt
              </LoadingLink>
              <LoadingLink
                href="/notifications"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Thông báo
              </LoadingLink>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white mb-1">Kết nối</h4>
            <div className="flex gap-3">
              <LoadingLink
                href="https://facebook.com/gearshop"
                className="p-1 bg-gray-800 rounded hover:bg-blue-600 transition-colors"
                target="_blank"
              >
                <PiFacebookLogo className="w-5 h-5" />
              </LoadingLink>
              <LoadingLink
                href="https://instagram.com/gearshop"
                className="p-1 bg-gray-800 rounded hover:bg-pink-500 transition-colors"
                target="_blank"
              >
                <PiInstagramLogo className="w-5 h-5" />
              </LoadingLink>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} GearShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
