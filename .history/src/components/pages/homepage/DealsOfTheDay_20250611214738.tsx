"use client";

import { useState, useEffect } from "react";
import { Flame, Clock, Star, TrendingUp, Zap } from "lucide-react";

interface Deal {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  stock: number;
  sold: number;
  category: string;
}

const deals: Deal[] = [
  {
    id: 1,
    name: "RTX 5090 Gaming Beast",
    price: 65000000,
    originalPrice: 75000000,
    discount: 13,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    timeLeft: {
      hours: 12,
      minutes: 30,
      seconds: 45,
    },
    stock: 25,
    sold: 15,
    category: "VGA"
  },
  {
    id: 2,
    name: "Intel Core Ultra 9 285K",
    price: 15500000,
    originalPrice: 18000000,
    discount: 14,
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    timeLeft: {
      hours: 8,
      minutes: 15,
      seconds: 20,
    },
    stock: 20,
    sold: 8,
    category: "CPU"
  },
];

export default function DealsOfTheDay() {
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const initialTimeLeft = deals.reduce((acc, deal) => {
      acc[deal.id] =
        deal.timeLeft.hours * 3600 +
        deal.timeLeft.minutes * 60 +
        deal.timeLeft.seconds;
      return acc;
    }, {} as { [key: number]: number });

    setTimeLeft(initialTimeLeft);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTimeLeft = { ...prev };
        Object.keys(newTimeLeft).forEach((key) => {
          const dealId = parseInt(key);
          if (newTimeLeft[dealId] > 0) {
            newTimeLeft[dealId] -= 1;
          }
        });
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getProgressPercentage = (sold: number, stock: number) => {
    return ((sold / (sold + stock)) * 100).toFixed(0);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 relative overflow-hidden">
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
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg backdrop-blur-sm animate-pulse">
            <Flame className="w-4 h-4 mr-2" />
            FLASH SALE - DEAL HOT
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-6 leading-tight">
            Flash Sale Siêu Hot
          </h2>
          
          <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Giảm giá khủng chỉ trong hôm nay - Nhanh tay kẻo hết stock!
          </p>
          
          {/* Timer Banner */}
          <div className="mt-8 inline-flex items-center bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl px-6 py-3">
            <Clock className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-300 font-semibold">Sale kết thúc trong:</span>
            <span className="text-white font-bold ml-2">23:59:59</span>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {deals.map((deal, index) => {
            const time = formatTime(timeLeft[deal.id] || 0);
            const progressPercentage = getProgressPercentage(deal.sold, deal.stock);

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
                      <TrendingUp className="w-4 h-4 mr-1" />
                      -{deal.discount}% OFF
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold border border-slate-700">
                      {deal.category}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row">
                    {/* Image Section */}
                    <div className="lg:w-1/2 relative overflow-hidden">
                      <img
                        src={deal.image}
                        alt={deal.name}
                        className="w-full h-64 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      
                      {/* Stock indicator on image */}
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                        Còn {deal.stock} sản phẩm
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 p-8 flex flex-col justify-between">
                      {/* Product Info */}
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-red-400 transition-colors duration-300">
                          {deal.name}
                        </h3>

                        {/* Price Section */}
                        <div className="mb-6">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                              {formatPrice(deal.price)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg text-slate-400 line-through">
                              {formatPrice(deal.originalPrice)}
                            </span>
                            <span className="text-sm text-green-400 font-semibold">
                              Tiết kiệm {formatPrice(deal.originalPrice - deal.price)}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>Đã bán: {deal.sold}</span>
                            <span className="text-red-400 font-semibold">{progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000 ease-out relative"
                              style={{ width: `${progressPercentage}%` }}
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
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {deal.name}
                    </h3>

                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl font-bold text-red-600">
                        {formatPrice(deal.price)}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(deal.originalPrice)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Đã bán: {deal.sold}</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">
                        Thời gian còn lại:
                      </div>
                      <div className="flex space-x-2">
                        <div className="bg-red-500 text-white px-3 py-2 rounded text-center">
                          <div className="text-lg font-bold">{time.hours}</div>
                          <div className="text-xs">Giờ</div>
                        </div>
                        <div className="bg-red-500 text-white px-3 py-2 rounded text-center">
                          <div className="text-lg font-bold">
                            {time.minutes}
                          </div>
                          <div className="text-xs">Phút</div>
                        </div>
                        <div className="bg-red-500 text-white px-3 py-2 rounded text-center">
                          <div className="text-lg font-bold">
                            {time.seconds}
                          </div>
                          <div className="text-xs">Giây</div>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors">
                      Mua Ngay
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
