"use client";

import { useState, useEffect } from "react";

interface Deal {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  timeLeft: number;
  stock: number;
  sold: number;
}

const deals: Deal[] = [
  {
    id: 1,
    name: "Kit Học Arduino Starter",
    price: 450000,
    originalPrice: 650000,
    discount: 31,
    image: "/api/placeholder/300/200",
    timeLeft: 14400, // 4 hours
    stock: 20,
    sold: 15,
  },
  {
    id: 2,
    name: "ESP32-CAM WiFi Module",
    price: 125000,
    originalPrice: 180000,
    discount: 31,
    image: "/api/placeholder/300/200",
    timeLeft: 28800, // 8 hours
    stock: 50,
    sold: 32,
  },
];

export default function DealsOfTheDay() {
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const initialTimeLeft = deals.reduce((acc, deal) => {
      acc[deal.id] = deal.timeLeft;
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
    <section className="py-16 bg-gradient-to-r from-red-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="animate-pulse mr-2">🔥</span>
            DEAL HOT TRONG NGÀY
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Flash Sale
          </h2>
          <p className="text-gray-600 text-lg">
            Giảm giá sốc chỉ trong hôm nay - Nhanh tay kẻo hết!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {deals.map((deal) => {
            const time = formatTime(timeLeft[deal.id] || 0);
            const progressPercentage = getProgressPercentage(
              deal.sold,
              deal.stock
            );

            return (
              <div
                key={deal.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-red-200"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>

                  <div className="md:w-1/2 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{deal.discount}%
                      </span>
                      <div className="text-sm text-gray-500">
                        Còn {deal.stock} sản phẩm
                      </div>
                    </div>

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
