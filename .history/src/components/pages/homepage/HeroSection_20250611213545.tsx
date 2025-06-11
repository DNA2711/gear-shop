"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
      subtitle: "32GB GDDR7 | DLSS 4 | 4K Ultra",
      description: "Card đồ họa mạnh nhất thế giới với kiến trúc Blackwell mới nhất",
      image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=1200&auto=format&fit=crop", // Gaming PC setup
      price: "Từ 65,000,000₫",
      badge: "HOT 2025",
      cta: "Xem Chi Tiết"
    },
    {
      title: "Intel i9-13900K Workstation",
      subtitle: "24 Cores | 32 Threads | 5.8GHz",
      description: "Bộ vi xử lý flagship cho gaming và content creation chuyên nghiệp",
      image: "https://images.unsplash.com/photo-1555617778-02518db0a93e?q=80&w=1200&auto=format&fit=crop", // CPU/motherboard
      price: "Từ 12,500,000₫",
      badge: "TRENDING",
      cta: "Khám Phá Ngay"
    },
    {
      title: "RTX 4080 Super Build",
      subtitle: "16GB GDDR6X | Ray Tracing | DLSS 3.5",
      description: "Hiệu năng 4K gaming hoàn hảo với mức giá hợp lý hơn",
      image: "https://images.unsplash.com/photo-1591238371650-73fdbdad7bb9?q=80&w=1200&auto=format&fit=crop", // RGB gaming setup
      price: "Từ 28,000,000₫",
      badge: "BEST VALUE",
      cta: "Mua Ngay"
    }
  ];

  const topProducts = [
    {
      icon: <Cpu className="w-8 h-8" />,
      name: "RTX 5090",
      description: "32GB GDDR7",
      price: "65M₫",
      hot: true
    },
    {
      icon: <HardDrive className="w-8 h-8" />,
      name: "Intel i9-13900K",
      description: "24 Cores, 5.8GHz",
      price: "12.5M₫",
      hot: true
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      name: "DDR5-6400 32GB",
      description: "Gaming RAM",
      price: "3.5M₫",
      hot: false
    },
    {
      icon: <Keyboard className="w-8 h-8" />,
      name: "SSD M.2 4TB",
      description: "PCIe 5.0 NVMe",
      price: "8.5M₫",
      hot: false
    }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_800px_600px_at_50%_0%,black,transparent)]" />
      title: "Gaming Setup",
      subtitle: "Nâng Tầm Trải Nghiệm Gaming",
      description:
        "Linh kiện gaming chính hãng, hiệu năng cao cho mọi game thủ",
      image:
        "https://images.unsplash.com/photo-1592840496694-26d035b52b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      badge: "HOT 2024",
      color: "from-red-600 to-orange-600",
    },
    {
      title: "Workstation Pro",
      subtitle: "Máy Tính Chuyên Nghiệp",
      description: "Cấu hình mạnh mẽ cho thiết kế, lập trình và render",
      image:
        "https://images.unsplash.com/photo-1547394765-185e1e68f34e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      badge: "ENTERPRISE",
      color: "from-blue-600 to-purple-600",
    },
    {
      title: "Budget Build",
      subtitle: "Linh Kiện Giá Tốt",
      description: "Xây dựng PC hiệu quả với ngân sách hợp lý",
      image:
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      badge: "TIẾT KIỆM",
      color: "from-green-600 to-blue-600",
    },
  ];

  const features = [
    { icon: Shield, text: "Bảo hành chính hãng", color: "text-green-400" },
    { icon: Truck, text: "Giao hàng toàn quốc", color: "text-blue-400" },
    { icon: Zap, text: "Hỗ trợ 24/7", color: "text-yellow-400" },
    { icon: Phone, text: "Tư vấn miễn phí", color: "text-purple-400" },
  ];

  const categories = [
    { icon: Cpu, name: "CPU", description: "Intel, AMD" },
    { icon: HardDrive, name: "SSD/HDD", description: "Samsung, WD" },
    { icon: Monitor, name: "Monitor", description: "Gaming, 4K" },
    { icon: Keyboard, name: "Keyboard", description: "Mechanical" },
    { icon: Mouse, name: "Mouse", description: "Gaming Pro" },
    { icon: Headphones, name: "Audio", description: "Headset, Speaker" },
  ];

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        {/* Main Hero Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div
            className={`lg:w-1/2 space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {/* Hero Badge */}
            <div
              className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentHero.color} rounded-full text-white font-semibold text-sm shadow-lg`}
            >
              <Star className="w-4 h-4 fill-current" />
              <span>{currentHero.badge}</span>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  {currentHero.title}
                </span>
                <br />
                <span className="text-3xl md:text-4xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {currentHero.subtitle}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-xl">
                {currentHero.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <span className="mr-2">Khám Phá Ngay</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
              </Link>

              <button className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 hover:border-blue-400 text-white hover:text-blue-400 font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span>Xem Video</span>
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg backdrop-blur-sm border border-gray-700/50"
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  <span className="text-gray-300 font-medium text-sm">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div
            className={`lg:w-1/2 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              {/* Main Hero Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src={currentHero.image}
                  alt={currentHero.title}
                  className="w-full h-96 md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                {/* Floating Elements */}
                <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce">
                  Miễn Phí Ship
                </div>

                <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg">
                  <div className="text-sm opacity-80">Giá từ</div>
                  <div className="text-2xl font-bold">999.000₫</div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-blue-600 text-white p-4 rounded-xl shadow-xl animate-pulse">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <div>
                    <div className="font-semibold text-sm">Hiệu Năng Cao</div>
                    <div className="text-xs opacity-80">Intel i9 Gen 12</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-purple-600 text-white p-4 rounded-xl shadow-xl animate-pulse delay-1000">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <div>
                    <div className="font-semibold text-sm">Bảo Hành 3 Năm</div>
                    <div className="text-xs opacity-80">Chính hãng 100%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Slide Indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-12 h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-blue-400 scale-125"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div className="text-gray-400 text-sm mb-2">Khám phá thêm</div>
          <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce mx-auto" />
        </div>
      </div>

      {/* Category Quick Access */}
      <div className="relative z-10 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-t border-gray-700/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/category/${category.name.toLowerCase()}`}
                className="group text-center p-4 rounded-lg hover:bg-gray-700/30 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors">
                  <category.icon className="w-8 h-8 text-blue-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
