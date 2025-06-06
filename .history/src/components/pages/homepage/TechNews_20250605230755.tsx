"use client";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: number;
}

const techNews: NewsItem[] = [
  {
    id: 1,
    title: "Hướng dẫn tạo hệ thống IoT với ESP32 và Arduino Cloud",
    excerpt:
      "Học cách kết nối ESP32 với Arduino Cloud để tạo ra một hệ thống IoT hoàn chỉnh, giám sát nhiệt độ và độ ẩm từ xa.",
    image: "/api/placeholder/400/250",
    date: "2024-01-15",
    category: "Tutorial",
    readTime: 8,
  },
  {
    id: 2,
    title: "Raspberry Pi 5 đã ra mắt - Có gì mới?",
    excerpt:
      "Khám phá những cải tiến mới nhất trên Raspberry Pi 5 với hiệu năng được nâng cấp đáng kể và các tính năng mới.",
    image: "/api/placeholder/400/250",
    date: "2024-01-12",
    category: "News",
    readTime: 5,
  },
  {
    id: 3,
    title: "Dự án: Robot tránh vật cản với Arduino và cảm biến siêu âm",
    excerpt:
      "Hướng dẫn chi tiết cách tạo robot có thể tự động tránh vật cản sử dụng Arduino Uno và cảm biến HC-SR04.",
    image: "/api/placeholder/400/250",
    date: "2024-01-10",
    category: "Project",
    readTime: 12,
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
      case "tutorial":
        return "bg-blue-100 text-blue-800";
      case "news":
        return "bg-green-100 text-green-800";
      case "project":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tin Tức & Hướng Dẫn
          </h2>
          <p className="text-gray-600 text-lg">
            Cập nhật những tin tức mới nhất và học hỏi từ các dự án thực tế
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                  <span className="mx-2">•</span>
                  <span>{item.readTime} phút đọc</span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                  {item.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.excerpt}
                </p>

                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Đọc thêm
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Xem Tất Cả Bài Viết
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white text-center">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-bold mb-2">Hướng Dẫn</h3>
            <p className="text-sm text-blue-100">50+ tutorial chi tiết</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white text-center">
            <div className="text-3xl mb-3">🔧</div>
            <h3 className="font-bold mb-2">Dự Án</h3>
            <p className="text-sm text-green-100">30+ dự án thực tế</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white text-center">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-bold mb-2">Tips & Tricks</h3>
            <p className="text-sm text-purple-100">Kinh nghiệm thực tế</p>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white text-center">
            <div className="text-3xl mb-3">🎥</div>
            <h3 className="font-bold mb-2">Video</h3>
            <p className="text-sm text-orange-100">Hướng dẫn qua video</p>
          </div>
        </div>
      </div>
    </section>
  );
}
