"use client";

import { useState, useEffect } from "react";
import { LoadingLink } from "@/components/ui/LoadingLink";
import {
  Cpu,
  HardDrive,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  ChevronRight,
  Play,
  Star,
  Zap,
  Shield,
  Truck,
  Phone,
  ArrowDown,
} from "lucide-react";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto slide for hero banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const heroSlides = [
    {
      title: "RTX 5090 Gaming Beast",
      subtitle: "32GB GDDR7 | DLSS 4 | Kiến trúc Blackwell",
      description:
        "Card đồ họa mạnh nhất thế giới với hiệu năng 4K Ultra Gaming đỉnh cao",
      image:
        "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      price: "Từ 65,000,000₫",
      badge: "HOT 2025",
      cta: "Xem Chi Tiết",
    },
    {
      title: "Intel Core Ultra 9 285K",
      subtitle: "24 Cores | 5.7GHz | Kiến trúc Arrow Lake",
      description:
        "Bộ vi xử lý flagship mới nhất với hiệu suất vượt trội và hiệu năng năng lượng tối ưu",
      image:
        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      price: "Từ 15,500,000₫",
      badge: "ARROW LAKE",
      cta: "Xem Chi Tiết",
    },
    {
      title: "HAVN HS 420 Gaming Case",
      subtitle: "Premium Gaming Case | RGB Support | Panoramic Glass",
      description:
        "Case gaming cao cấp nhất 2025 với thiết kế panoramic và hệ thống tản nhiệt hoàn hảo",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      price: "Từ 4,500,000₫",
      badge: "BEST CASE 2025",
      cta: "Xem Chi Tiết",
    },
  ];

  // Hot products with updated information
  const hotProducts = [
    {
      name: "RTX 5090",
      specs: "32GB GDDR7 - Blackwell",
      price: "65M₫",
      hot: true,
    },
    {
      name: "Core Ultra 9 285K",
      specs: "24 Cores, 5.7GHz - Arrow Lake",
      price: "15.5M₫",
      hot: true,
    },
    {
      name: "DDR5-6400 32GB",
      specs: "Gaming RAM - High Speed",
      price: "3.5M₫",
      hot: false,
    },
    {
      name: "HAVN HS 420",
      specs: "Premium Gaming Case",
      price: "4.5M₫",
      hot: true,
    },
    {
      name: "Z890 Motherboard",
      specs: "LGA 1851 - Latest Socket",
      price: "8M₫",
      hot: false,
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden scroll-section">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_800px_600px_at_50%_0%,black,transparent)]" />

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${(i * 5.26) % 100}%`,
                top: `${(i * 3.74) % 100}%`,
                animationDelay: `${(i * 0.1) % 2}s`,
                animationDuration: `${2 + ((i * 0.2) % 2)}s`,
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh]">
          {/* Left Content */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {/* Main Headlines */}
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 backdrop-blur-sm">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-2" />
                <span className="text-xs sm:text-sm font-medium text-blue-300">
                  Linh Kiện Hot Nhất 2025
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                  Gear Shop
                </span>
                <br />
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-gray-300">
                  Linh Kiện Máy Tính Hàng Đầu
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg">
                Khám phá những linh kiện máy tính{" "}
                <span className="text-blue-400 font-semibold">
                  hot nhất 2025
                </span>{" "}
                với hiệu năng vượt trội và công nghệ tiên tiến nhất.
              </p>
            </div>

            {/* Current Slide Info */}
            <div className="p-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    heroSlides[currentSlide].badge === "HOT 2025"
                      ? "bg-red-500 text-white"
                      : heroSlides[currentSlide].badge === "TRENDING"
                      ? "bg-orange-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {heroSlides[currentSlide].badge}
                </span>
                <span className="text-2xl font-bold text-green-400">
                  {heroSlides[currentSlide].price}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {heroSlides[currentSlide].title}
              </h3>
              <p className="text-blue-300 font-medium mb-2">
                {heroSlides[currentSlide].subtitle}
              </p>
              <p className="text-gray-300 text-sm">
                {heroSlides[currentSlide].description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <LoadingLink
                href="/products"
                loadingMessage="Đang tải danh sách sản phẩm..."
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Mua Sắm Ngay
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </LoadingLink>

              <LoadingLink
                href="/pc-builder"
                loadingMessage="Đang mở PC Builder..."
                className="group px-8 py-4 border-2 border-blue-500/50 rounded-xl font-semibold text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  Xây Dựng PC
                </span>
              </LoadingLink>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Bảo Hành 3 Năm</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Giao Hàng 24h</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>Hỗ Trợ 24/7</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image Slider */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
              {/* Hero Image */}
              <div className="absolute inset-0">
                <img
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Slide Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">
                  {heroSlides[currentSlide].title}
                </h3>
                <p className="text-blue-200 mb-4">
                  {heroSlides[currentSlide].subtitle}
                </p>
                <LoadingLink
                  href="/products"
                  loadingMessage="Đang tải sản phẩm..."
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
                >
                  {heroSlides[currentSlide].cta}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </LoadingLink>
              </div>

              {/* Slide Indicators */}
              <div className="absolute top-6 right-6 flex space-x-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-blue-400 scale-125"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-blue-400" />
        </div>
      </div>
    </section>
  );
}
