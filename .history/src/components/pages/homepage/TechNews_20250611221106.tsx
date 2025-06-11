"use client";

import {
  Calendar,
  Clock,
  BookOpen,
  TrendingUp,
  Star,
  ArrowRight,
  User,
} from "lucide-react";
import Image from "next/image";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
  trending?: boolean;
}

const techNews: NewsItem[] = [
  {
    id: 1,
    title: "RTX 5090: Card đồ họa mạnh nhất thế giới ra mắt",
    excerpt:
      "NVIDIA công bố RTX 5090 với kiến trúc Blackwell mới, hiệu năng vượt trội gấp 2 lần RTX 4090...",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    date: "15/01/2025",
    category: "Hardware",
    readTime: "5 phút đọc",
    trending: true,
  },
  {
    id: 2,
    title: "Intel Core Ultra 9 285K: Cuộc cách mạng kiến trúc Arrow Lake",
    excerpt:
      "Bộ vi xử lý flagship mới với 24 cores và hiệu suất năng lượng cải thiện đáng kể...",
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    date: "12/01/2025",
    category: "CPU",
    readTime: "4 phút đọc",
    trending: true,
  },
  {
    id: 3,
    title: "DDR5-8000: Bộ nhớ RAM gaming tốc độ cao mới",
    excerpt:
      "Công nghệ RAM thế hệ mới với băng thông cực khủng cho gaming và content creation...",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    date: "10/01/2025",
    category: "Memory",
    readTime: "3 phút đọc",
  },
];

const sideArticles = [
  {
    title: "AMD Ryzen 9 9950X vs Intel Core Ultra 9 285K",
    excerpt:
      "So sánh chi tiết hiệu năng gaming và productivity của hai CPU flagship...",
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop",
    date: "08/01/2025",
    category: "Review",
    readTime: "6 phút đọc",
  },
  {
    title: "RTX 5080 vs RTX 4090: Đâu là lựa chọn tốt nhất?",
    excerpt: "Phân tích hiệu năng và giá trị của hai card đồ họa high-end...",
    image:
      "https://images.unsplash.com/photo-1593640495253-23196b27a87a?w=400&h=300&fit=crop",
    date: "06/01/2025",
    category: "Comparison",
    readTime: "5 phút đọc",
  },
  {
    title: "Xu hướng Gaming Setup 2025",
    excerpt:
      "Những thiết bị gaming hot nhất và xu hướng setup gaming năm 2025...",
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop",
    date: "04/01/2025",
    category: "Trend",
    readTime: "4 phút đọc",
  },
  {
    title: "PSU Calculator: Chọn nguồn máy tính phù hợp",
    excerpt:
      "Hướng dẫn tính toán công suất nguồn máy tính cho từng cấu hình...",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
    date: "02/01/2025",
    category: "Guide",
    readTime: "7 phút đọc",
  },
];

const quickLinks = [
  { icon: BookOpen, title: "CPU Reviews", count: 45 },
  { icon: Star, title: "GPU Tests", count: 38 },
  { icon: TrendingUp, title: "Trending", count: 23 },
  { icon: Clock, title: "Latest", count: 67 },
];

export default function TechNews() {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "hardware":
        return "bg-blue-600/80";
      case "cpu":
        return "bg-green-600/80";
      case "memory":
        return "bg-purple-600/80";
      case "review":
        return "bg-orange-600/80";
      case "comparison":
        return "bg-red-600/80";
      case "trend":
        return "bg-pink-600/80";
      case "guide":
        return "bg-cyan-600/80";
      default:
        return "bg-slate-600/80";
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden scroll-section">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg backdrop-blur-sm">
            <BookOpen className="w-4 h-4 mr-2" />
            TECH NEWS & REVIEWS
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
            Tin Tức & Đánh Giá
          </h2>

          <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Cập nhật những tin tức mới nhất và đánh giá chi tiết về công nghệ
            phần cứng
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            <article className="group bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="relative h-48 lg:h-56 xl:h-44 2xl:h-40 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1555617983-731a6ad4b95c?w=800&h=400&fit=crop"
                  alt="RTX 5090 Announcement"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                {/* Trending Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <TrendingUp className="w-3 h-3" />
                  TRENDING
                </div>

                {/* Category */}
                <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
                  Hardware
                </div>
              </div>

              <div className="p-4 lg:p-6 xl:p-4 2xl:p-5">
                <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>15/01/2025</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Tech Editor</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>5 phút đọc</span>
                  </div>
                </div>

                <h2 className="text-xl lg:text-2xl xl:text-xl 2xl:text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  NVIDIA RTX 5090 Ra Mắt: Hiệu Năng Vượt Trội Với 32GB GDDR7
                </h2>

                <p className="text-slate-300 mb-4 line-clamp-3">
                  Card đồ họa flagship mới nhất của NVIDIA với kiến trúc
                  Blackwell, mang đến hiệu năng gaming 4K và AI computing đỉnh
                  cao. Tìm hiểu về các tính năng đột phá và giá bán chính thức
                  tại Việt Nam.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-slate-400">
                      (128 đánh giá)
                    </span>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2">
                    Đọc thêm
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Side Articles */}
          <div className="space-y-4 lg:space-y-6">
            {sideArticles.map((article, index) => (
              <article
                key={index}
                className="group bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20"
              >
                <div className="flex">
                  <div className="relative w-24 h-20 lg:w-32 lg:h-24 xl:w-28 xl:h-20 2xl:w-30 2xl:h-22 flex-shrink-0">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/30" />

                    {/* Category Badge */}
                    <div
                      className={`absolute top-1 left-1 ${getCategoryColor(
                        article.category
                      )} text-white px-1.5 py-0.5 rounded text-xs font-medium`}
                    >
                      {article.category}
                    </div>
                  </div>

                  <div className="flex-1 p-3 lg:p-4 xl:p-3 2xl:p-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                      <Clock className="w-3 h-3 ml-2" />
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-sm lg:text-base xl:text-sm 2xl:text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
                      {article.title}
                    </h3>

                    <p className="text-xs lg:text-sm xl:text-xs 2xl:text-xs text-slate-400 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-8">
          {quickLinks.map((link, index) => (
            <div
              key={index}
              className="group bg-slate-800/20 backdrop-blur-sm rounded-lg border border-slate-700/30 p-3 lg:p-4 xl:p-3 2xl:p-3 text-center hover:border-blue-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <link.icon className="w-5 h-5 lg:w-6 lg:h-6 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5 mx-auto text-blue-400 mb-2 group-hover:text-white transition-colors duration-300" />
              <h4 className="text-xs lg:text-sm xl:text-xs 2xl:text-xs font-medium text-white group-hover:text-blue-300 transition-colors duration-300">
                {link.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {link.count} bài viết
              </p>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
            Xem Tất Cả Bài Viết
            <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
