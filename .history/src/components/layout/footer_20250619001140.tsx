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

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">GearShop</h3>
            </div>

            <p className="text-gray-300 leading-relaxed">
              Cửa hàng công nghệ hàng đầu Việt Nam, chuyên cung cấp các sản phẩm
              điện tử, linh kiện máy tính, điện thoại và phụ kiện công nghệ
              chính hãng.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span>123 Đường Nguyễn Văn Cừ, Q.1, TP.HCM</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-5 w-5 text-blue-400" />
                <span>0359.746.693</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-5 w-5 text-blue-400" />
                <span>info@gearshop.vn</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>8:00 - 22:00 (Thứ 2 - Chủ nhật)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white">Liên kết nhanh</h4>
            <div className="space-y-3">
              <LoadingLink
                href="/products"
                loadingMessage="Đang tải sản phẩm..."
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Sản phẩm
              </LoadingLink>
              <LoadingLink
                href="/brands"
                loadingMessage="Đang tải thương hiệu..."
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Thương hiệu
              </LoadingLink>
              <LoadingLink
                href="/categories"
                loadingMessage="Đang tải danh mục..."
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Danh mục
              </LoadingLink>
              <LoadingLink
                href="/deals"
                loadingMessage="Đang tải khuyến mãi..."
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Khuyến mãi
              </LoadingLink>
              <LoadingLink
                href="/blog"
                loadingMessage="Đang tải tin tức công nghệ..."
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Tin tức công nghệ
              </LoadingLink>
              <LoadingLink
                href="/contact"
                loadingMessage="Đang tải liên hệ..."
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Liên hệ
              </LoadingLink>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white">Hỗ trợ khách hàng</h4>
            <div className="space-y-3">
              <LoadingLink
                href="/warranty"
                loadingMessage="Đang tải chính sách bảo hành..."
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Chính sách bảo hành
              </LoadingLink>
              <LoadingLink
                href="/return"
                loadingMessage="Đang tải đổi trả hàng..."
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Đổi trả hàng
              </LoadingLink>
              <LoadingLink
                href="/shipping"
                loadingMessage="Đang tải vận chuyển..."
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Vận chuyển
              </LoadingLink>
              <LoadingLink
                href="/payment"
                loadingMessage="Đang tải thanh toán..."
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Thanh toán
              </LoadingLink>
              <LoadingLink
                href="/faq"
                loadingMessage="Đang tải câu hỏi thường gặp..."
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Câu hỏi thường gặp
              </LoadingLink>
              <LoadingLink
                href="/privacy"
                loadingMessage="Đang tải chính sách bảo mật..."
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Chính sách bảo mật
              </LoadingLink>
            </div>
          </div>

          {/* Features & Social */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white">
              Tại sao chọn GearShop?
            </h4>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-gray-300 text-sm">
                  Hàng chính hãng 100%
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-400" />
                <span className="text-gray-300 text-sm">
                  Giao hàng toàn quốc
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Headphones className="h-5 w-5 text-green-400" />
                <span className="text-gray-300 text-sm">Hỗ trợ 24/7</span>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white">
                Theo dõi chúng tôi
              </h5>
              <div className="flex space-x-4">
                <LoadingLink
                  href="https://facebook.com/gearshop"
                  loadingMessage="Đang tải trang Facebook..."
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <PiFacebookLogo className="w-5 h-5" />
                </LoadingLink>

                <LoadingLink
                  href="https://instagram.com/gearshop"
                  loadingMessage="Đang tải trang Instagram..."
                  className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  <PiInstagramLogo className="w-5 h-5" />
                </LoadingLink>

                <LoadingLink
                  href="https://youtube.com/gearshop"
                  loadingMessage="Đang tải trang YouTube..."
                  className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <PiYoutubeLogo className="w-5 h-5" />
                </LoadingLink>

                <LoadingLink
                  href="https://tiktok.com/@gearshop"
                  loadingMessage="Đang tải trang TikTok..."
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <PiTiktokLogo className="w-5 h-5" />
                </LoadingLink>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h5 className="text-lg font-semibold text-white">
                Đăng ký nhận tin
              </h5>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 GearShop. Tất cả quyền được bảo lưu.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Công ty TNHH Công Nghệ GearShop | Mã số thuế: 0123456789
              </p>
            </div>

            <div className="flex space-x-6 text-sm">
              <LoadingLink
                href="/terms"
                loadingMessage="Đang tải điều khoản sử dụng..."
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Điều khoản sử dụng
              </LoadingLink>
              <LoadingLink
                href="/privacy"
                loadingMessage="Đang tải chính sách bảo mật..."
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Chính sách bảo mật
              </LoadingLink>
              <LoadingLink
                href="/sitemap"
                loadingMessage="Đang tải sơ đồ trang web..."
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Sơ đồ trang web
              </LoadingLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
