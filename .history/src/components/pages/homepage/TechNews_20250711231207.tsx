"use client";

import {
  Calendar,
  Clock,
  BookOpen,
  TrendingUp,
  Star,
  ArrowRight,
} from "lucide-react";
import { LoadingLink } from "@/components/ui/LoadingLink";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: number;
  trending?: boolean;
}

const techNews: NewsItem[] = [
  {
    id: 1,
    title: "RTX 5090 ra mắt với hiệu năng đột phá",
    excerpt:
      "NVIDIA chính thức giới thiệu RTX 5090 với kiến trúc Blackwell, mang lại hiệu năng game 4K vượt trội.",
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    date: "2024-12-15",
    category: "GPU News",
    readTime: 5,
    trending: true,
  },
  {
    id: 2,
    title: "Intel Arrow Lake - Cuộc cách mạng CPU mới",
    excerpt:
      "Bộ vi xử lý Intel Core Ultra thế hệ mới với hiệu suất tăng 20% và tiết kiệm điện năng đáng kể.",
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    date: "2024-12-12",
    category: "CPU News",
    readTime: 4,
    trending: true,
  },
  {
    id: 3,
    title: "DDR5-8000 - Tốc độ RAM mới đáng kinh ngạc",
    excerpt:
      "Công nghệ RAM DDR5 thế hệ mới đạt tốc độ 8000MHz, mở ra kỷ nguyên mới cho hiệu năng máy tính.",
    image:
      "https://havn.global/cdn/shop/files/C1-B_6c291d68-93d7-402e-a432-bc7178ea0f8b.png?v=1724055888&width=800",
    date: "2024-12-10",
    category: "Memory",
    readTime: 3,
  },
];

export default function TechNews() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "gpu news":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cpu news":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "memory":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <section className="relative overflow-hidden scroll-section py-12 sm:py-16 lg:py-20">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-lg backdrop-blur-sm">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            TECH NEWS & REVIEWS
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
            Tin Tức & Đánh Giá
          </h2>

          <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            Cập nhật những tin tức mới nhất và đánh giá chi tiết về công nghệ
            phần cứng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {techNews.map((item, index) => (
            <article
              key={item.id}
              className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.trending && (
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    HOT
                  </div>
                </div>
              )}

              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex items-center text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <time dateTime={item.date} className="mr-2 sm:mr-3 truncate">
                    {formatDate(item.date)}
                  </time>
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>{item.readTime} phút đọc</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 leading-tight group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-slate-300 mb-4 sm:mb-6 line-clamp-3 leading-relaxed text-sm sm:text-base">
                  {item.excerpt}
                </p>

                <button className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 group text-sm sm:text-base">
                  Đọc thêm
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            </article>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
              📚
            </div>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2">Hướng Dẫn</h3>
            <p className="text-slate-300 mb-2 sm:mb-3 text-xs sm:text-sm">50+ tutorial chi tiết</p>
            <div className="text-blue-400 font-semibold text-xs sm:text-sm">
              Build PC, Overclock, Setup
            </div>
          </div>

          <div className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
              🔧
            </div>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2">Reviews</h3>
            <p className="text-slate-300 mb-2 sm:mb-3 text-xs sm:text-sm">30+ đánh giá chi tiết</p>
            <div className="text-green-400 font-semibold text-xs sm:text-sm">
              GPU, CPU, Gaming Gear
            </div>
          </div>

          <div className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
              💡
            </div>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2">Tips & Tricks</h3>
            <p className="text-slate-300 mb-2 sm:mb-3 text-xs sm:text-sm">Kinh nghiệm từ pro</p>
            <div className="text-purple-400 font-semibold text-xs sm:text-sm">
              Performance, Optimization
            </div>
          </div>

          <div className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
              🎥
            </div>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2">Video</h3>
            <p className="text-slate-300 mb-2 sm:mb-3 text-xs sm:text-sm">Hướng dẫn video</p>
            <div className="text-orange-400 font-semibold text-xs sm:text-sm">
              YouTube, Live Stream
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 bg-slate-800/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="group">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300"
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                4.9/5
              </div>
              <div className="text-slate-300 text-sm sm:text-base">Đánh giá từ cộng đồng</div>
            </div>

            <div className="group">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                100K+
              </div>
              <div className="text-slate-300 text-sm sm:text-base">Lượt đọc mỗi tháng</div>
            </div>

            <div className="group">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-slate-300 text-sm sm:text-base">Cập nhật tin tức mới</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
