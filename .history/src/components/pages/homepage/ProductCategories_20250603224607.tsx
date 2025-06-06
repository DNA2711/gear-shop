"use client";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  count: number;
  color: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: "Arduino & Microcontrollers",
    description: "Vi điều khiển, board mạch phát triển",
    icon: "🔧",
    count: 125,
    color: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    name: "Sensors & Modules",
    description: "Cảm biến nhiệt độ, độ ẩm, ánh sáng",
    icon: "📡",
    count: 89,
    color: "from-green-400 to-green-600",
  },
  {
    id: 3,
    name: "Displays & LEDs",
    description: "LCD, OLED, LED matrix, đèn LED",
    icon: "💡",
    count: 67,
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: 4,
    name: "Motors & Servos",
    description: "Động cơ servo, stepper, DC motor",
    icon: "⚙️",
    count: 45,
    color: "from-purple-400 to-purple-600",
  },
  {
    id: 5,
    name: "Power & Batteries",
    description: "Nguồn điện, pin, module sạc",
    icon: "🔋",
    count: 78,
    color: "from-red-400 to-red-600",
  },
  {
    id: 6,
    name: "Tools & Accessories",
    description: "Dụng cụ hàn, dây nối, breadboard",
    icon: "🛠️",
    count: 156,
    color: "from-gray-400 to-gray-600",
  },
];

export default function ProductCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Danh Mục Sản Phẩm
          </h2>
          <p className="text-gray-600 text-lg">
            Khám phá các danh mục linh kiện điện tử phong phú
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div
                  className={`bg-gradient-to-br ${category.color} p-6 text-white`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="text-right">
                      <div className="text-sm opacity-80">Sản phẩm</div>
                      <div className="text-2xl font-bold">{category.count}</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>

                  <div className="mt-4 flex items-center text-sm">
                    <span>Xem thêm</span>
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform"
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
                  </div>
                </div>

                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
            <div className="text-gray-600">
              <span className="font-semibold">500+</span> sản phẩm có sẵn
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="text-gray-600">
              <span className="font-semibold">24/7</span> hỗ trợ kỹ thuật
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="text-gray-600">
              <span className="font-semibold">Miễn phí</span> vận chuyển
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
