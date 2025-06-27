"use client";

import { useState, useEffect } from "react";
import { Flame, Clock, Star, TrendingUp, Zap } from "lucide-react";

interface Deal {
  id: number;
  name: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  timeLeft: string;
  stock: number;
  image: string;
  badge: string;
  specs: string[];
}

const deals: Deal[] = [
  {
    id: 1,
    name: "RTX 5090 Gaming Beast",
    originalPrice: 70000000,
    currentPrice: 65000000,
    discount: 7,
    timeLeft: "23:45:12",
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    badge: "SIÊU HOT",
    specs: ["32GB GDDR7", "Blackwell Architecture", "DLSS 4.0"],
  },
  {
    id: 2,
    name: "Intel Core Ultra 9 285K",
    originalPrice: 16500000,
    currentPrice: 15500000,
    discount: 6,
    timeLeft: "18:22:35",
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    badge: "ARROW LAKE",
    specs: ["24 Cores", "5.7GHz Max", "Arrow Lake"],
  },
];

export default function DealsOfTheDay() {
  // Timer state for countdown display
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <section className="relative overflow-hidden scroll-section">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-lg backdrop-blur-sm animate-pulse">
            <Flame className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            FLASH SALE - DEAL HOT
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
            Flash Sale Siêu Hot
          </h2>

          <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            Giảm giá khủng chỉ trong hôm nay - Nhanh tay kẻo hết stock!
          </p>

          {/* Timer Banner */}
          <div className="mt-6 sm:mt-8 inline-flex items-center bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl px-4 sm:px-6 py-2 sm:py-3">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2" />
            <span className="text-red-300 font-semibold text-sm sm:text-base">
              Sale kết thúc trong:
            </span>
            <span className="text-white font-bold ml-2 text-sm sm:text-base">
              23:59:59
            </span>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {deals.map((deal, index) => {
            const [hours, minutes, seconds] = deal.timeLeft
              .split(":")
              .map(Number);

            return (
              <div
                key={deal.id}
                className="group relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-red-500/20 hover:border-red-500/50 transition-all duration-500 hover:scale-105">
                  {/* Hot Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />-{deal.discount}%
                      OFF
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold border border-slate-700">
                      {deal.badge}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row">
                    {/* Image Section */}
                    <div className="lg:w-1/2 relative overflow-hidden">
                      <img
                        src={deal.image}
                        alt={deal.name}
                        className="w-full h-48 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                      {/* Stock indicator on image */}
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                        Còn {deal.stock} sản phẩm
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between">
                      {/* Product Info */}
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 leading-tight group-hover:text-red-400 transition-colors duration-300 line-clamp-2">
                          {deal.name}
                        </h3>

                        {/* Price Section */}
                        <div className="mb-6">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                              {formatPrice(deal.currentPrice)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg text-slate-400 line-through">
                              {formatPrice(deal.originalPrice)}
                            </span>
                            <span className="text-sm text-green-400 font-semibold">
                              Tiết kiệm{" "}
                              {formatPrice(
                                deal.originalPrice - deal.currentPrice
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Specs */}
                        <div className="mb-6">
                          <div className="grid grid-cols-1 gap-2">
                            {deal.specs.map((spec, i) => (
                              <div
                                key={i}
                                className="flex items-center text-sm text-slate-300"
                              >
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></div>
                                {spec}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stock Bar */}
                        <div className="mb-6">
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>Còn lại: {deal.stock} sản phẩm</span>
                            <span className="text-red-400 font-semibold">
                              🔥 HOT SALE
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000 ease-out relative"
                              style={{ width: `${(deal.stock / 50) * 100}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timer */}
                      <div className="mb-6">
                        <div className="text-sm text-slate-300 mb-3 flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                          Thời gian còn lại:
                        </div>
                        <div className="flex space-x-2">
                          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white px-3 py-2 rounded-xl text-center shadow-lg min-w-[50px]">
                            <div className="text-lg font-bold">
                              {String(hours).padStart(2, "0")}
                            </div>
                            <div className="text-xs opacity-80">Giờ</div>
                          </div>
                          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-3 py-2 rounded-xl text-center shadow-lg min-w-[50px]">
                            <div className="text-lg font-bold">
                              {String(minutes).padStart(2, "0")}
                            </div>
                            <div className="text-xs opacity-80">Phút</div>
                          </div>
                          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white px-3 py-2 rounded-xl text-center shadow-lg min-w-[50px]">
                            <div className="text-lg font-bold">
                              {String(seconds).padStart(2, "0")}
                            </div>
                            <div className="text-xs opacity-80">Giây</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 lg:py-4 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg">
                        🔥 MUA NGAY - {deal.discount}% OFF
                      </button>
                    </div>
                  </div>

                  Shine Effect
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
