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
  readTime: number;
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
    date: "2024-12-15",
    category: "GPU News",
    readTime: 5,
    trending: true,
  },
  {
    id: 2,
    title: "Intel Core Ultra 9 285K: Cuộc cách mạng kiến trúc Arrow Lake",
    excerpt:
      "Bộ vi xử lý flagship mới với 24 cores và hiệu suất năng lượng cải thiện đáng kể...",
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    date: "2024-12-12",
    category: "CPU News",
    readTime: 4,
    trending: true,
  },
  {
    id: 3,
    title: "DDR5-8000: Bộ nhớ RAM gaming tốc độ cao mới",
    excerpt:
      "Công nghệ RAM thế hệ mới với băng thông cực khủng cho gaming và content creation...",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    date: "2024-12-10",
    category: "Memory",
    readTime: 3,
  },
];

const sideArticles = [
  {
    title: "Intel Core Ultra 9 285K: Cuộc cách mạng kiến trúc Arrow Lake",
    excerpt:
      "Bộ vi xử lý flagship mới với 24 cores và hiệu suất năng lượng cải thiện đáng kể",
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    date: "12/01/2025",
    category: "CPU",
    readTime: "4 phút",
  },
  {
    title: "DDR5-8000: Bộ nhớ RAM gaming tốc độ cao mới",
    excerpt:
      "Công nghệ RAM thế hệ mới với băng thông cực khủng cho gaming và content creation",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    date: "10/01/2025",
    category: "Memory",
    readTime: "3 phút",
  },
];

const quickLinks = [
  { title: "Hướng Dẫn", count: 50, icon: BookOpen },
  { title: "Reviews", count: 30, icon: Star },
  { title: "Tips & Tricks", count: 25, icon: TrendingUp },
  { title: "Video", count: 40, icon: Clock },
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
      case "gpu":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cpu news":
      case "cpu":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "memory":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <section className="scroll-section bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16 lg:py-20 xl:py-16 2xl:py-18 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 xl:mb-12 2xl:mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-4">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">
              Tech News & Reviews
            </span>
          </div>

          <h2 className="text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-bold text-white mb-4">
            Tin Tức & Đánh Giá Công Nghệ
          </h2>

          <p className="text-lg lg:text-xl xl:text-lg 2xl:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Cập nhật những tin tức mới nhất và đánh giá chi tiết về công nghệ
            phần cứng
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-6 2xl:gap-8 mb-12">
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

        {/* Bottom Stats */}
        <div className="mt-12 lg:mt-16 xl:mt-12 2xl:mt-14 bg-slate-800/20 backdrop-blur-sm rounded-2xl p-6 lg:p-8 xl:p-6 2xl:p-8 border border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-center">
            <div className="group">
              <div className="flex items-center justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 lg:w-6 lg:h-6 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300"
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <div className="text-2xl lg:text-3xl xl:text-2xl 2xl:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <div className="text-slate-300 text-sm lg:text-base xl:text-sm 2xl:text-base">
                Đánh giá từ cộng đồng
              </div>
            </div>

            <div className="group">
              <div className="text-2xl lg:text-3xl xl:text-2xl 2xl:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                100K+
              </div>
              <div className="text-slate-300 text-sm lg:text-base xl:text-sm 2xl:text-base">
                Lượt đọc mỗi tháng
              </div>
            </div>

            <div className="group">
              <div className="text-2xl lg:text-3xl xl:text-2xl 2xl:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-slate-300 text-sm lg:text-base xl:text-sm 2xl:text-base">
                Cập nhật tin tức mới
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
