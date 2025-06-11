"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, Zap, Gift, Bell, Star } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 2000);
  };

  if (isSubscribed) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden scroll-section">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
                Đăng ký thành công! 🎉
              </h2>

              <p className="text-slate-300 text-lg leading-relaxed">
                Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi những tin tức công nghệ
                mới nhất và ưu đãi độc quyền đến email của bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
                <Gift className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">
                  Ưu đãi độc quyền
                </h3>
                <p className="text-slate-300 text-sm">
                  Giảm giá lên đến 30% cho thành viên
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
                <Bell className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">
                  Tin tức sớm nhất
                </h3>
                <p className="text-slate-300 text-sm">
                  Cập nhật sản phẩm mới trước ai hết
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
                <Star className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">
                  Review chuyên sâu
                </h3>
                <p className="text-slate-300 text-sm">
                  Đánh giá chi tiết từ chuyên gia
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 relative overflow-hidden scroll-section">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg backdrop-blur-sm">
              <Mail className="w-4 h-4 mr-2" />
              NEWSLETTER EXCLUSIVE
            </div>

            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
              Đăng Ký Nhận Tin
            </h2>

            <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
              Nhận thông tin mới nhất về công nghệ, ưu đãi độc quyền và review
              chi tiết
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Benefits */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Tin tức công nghệ nóng hổi
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Cập nhật những xu hướng mới nhất về gaming hardware, AI và
                    công nghệ.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Ưu đãi độc quyền
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Giảm giá đặc biệt, flash sale và voucher chỉ dành cho thành
                    viên newsletter.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Review chuyên sâu
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Đánh giá chi tiết từ team chuyên gia về CPU, GPU và gaming
                    gear.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      50K+
                    </div>
                    <div className="text-slate-300 text-sm">Subscribers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-400">
                      Weekly
                    </div>
                    <div className="text-slate-300 text-sm">Updates</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">30%</div>
                    <div className="text-slate-300 text-sm">Discount</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Tham gia cộng đồng
                </h3>
                <p className="text-slate-300 text-sm">
                  Miễn phí 100% - Hủy đăng ký bất cứ lúc nào
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Đăng ký ngay
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  Bằng việc đăng ký, bạn đồng ý với{" "}
                  <a
                    href="#"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    Điều khoản sử dụng
                  </a>{" "}
                  và{" "}
                  <a
                    href="#"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    Chính sách bảo mật
                  </a>
                </p>
              </form>

              {/* Social Proof */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-300 text-center">
                  "Newsletter tốt nhất về công nghệ mà tôi từng đăng ký!" -{" "}
                  <span className="text-purple-400">Tech Pro</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
