"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, Zap, Gift, Bell, Star, Check, ArrowRight } from "lucide-react";

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
          <div className="max-w-2xl xl:max-w-xl 2xl:max-w-2xl mx-auto text-center">
            <div className="bg-slate-800/20 backdrop-blur-lg rounded-2xl border border-slate-700/30 p-8 lg:p-12 xl:p-8 2xl:p-10">
              <div className="mb-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 xl:w-16 xl:h-16 2xl:w-18 2xl:h-18 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 lg:w-10 lg:h-10 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-white" />
                </div>
                
                <h2 className="text-2xl lg:text-3xl xl:text-2xl 2xl:text-3xl font-bold text-white mb-3">
                  Đăng Ký Thành Công!
                </h2>
                
                <p className="text-slate-300 text-base lg:text-lg xl:text-base 2xl:text-lg">
                  Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi email xác nhận và những thông tin hữu ích nhất đến bạn.
                </p>
              </div>

              <button
                onClick={() => setIsSubscribed(false)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Đăng ký email khác
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
        {!isSubscribed ? (
          /* Signup Form */
          <div className="max-w-4xl xl:max-w-3xl 2xl:max-w-4xl mx-auto text-center">
            <div className="bg-slate-800/20 backdrop-blur-lg rounded-2xl border border-slate-700/30 p-8 lg:p-12 xl:p-8 2xl:p-10">
              {/* Header */}
              <div className="mb-8 lg:mb-10 xl:mb-8 2xl:mb-8">
                <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-4 py-2 mb-4">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 text-sm font-medium">Đăng ký nhận tin</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-bold text-white mb-4">
                  Cập Nhật Công Nghệ Mới Nhất
                </h2>
                
                <p className="text-lg lg:text-xl xl:text-lg 2xl:text-lg text-slate-300 leading-relaxed">
                  Nhận thông tin về sản phẩm mới, deal hot và tin tức công nghệ hàng tuần
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 xl:gap-3 2xl:gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email của bạn..."
                      className="w-full px-4 py-3 lg:py-4 xl:py-3 2xl:py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 lg:py-4 xl:py-3 2xl:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Đăng ký</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                </div>
              </form>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 xl:gap-4 2xl:gap-6 mt-8 lg:mt-10 xl:mt-8 2xl:mt-8">
                <div className="flex items-center gap-3 p-3 lg:p-4 xl:p-3 2xl:p-3 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                  <Zap className="w-5 h-5 lg:w-6 lg:h-6 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-sm lg:text-base xl:text-sm 2xl:text-sm text-slate-300">Tin tức công nghệ nóng hổi</span>
                </div>
                <div className="flex items-center gap-3 p-3 lg:p-4 xl:p-3 2xl:p-3 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                  <Gift className="w-5 h-5 lg:w-6 lg:h-6 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-sm lg:text-base xl:text-sm 2xl:text-sm text-slate-300">Ưu đãi độc quyền</span>
                </div>
                <div className="flex items-center gap-3 p-3 lg:p-4 xl:p-3 2xl:p-3 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                  <Star className="w-5 h-5 lg:w-6 lg:h-6 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-sm lg:text-base xl:text-sm 2xl:text-sm text-slate-300">Review chuyên sâu</span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-6 mt-6 lg:mt-8 xl:mt-6 2xl:mt-6 pt-6 border-t border-slate-700/30">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl xl:text-xl 2xl:text-xl font-bold text-white">50K+</div>
                  <div className="text-xs lg:text-sm xl:text-xs 2xl:text-sm text-slate-400">Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl xl:text-xl 2xl:text-xl font-bold text-white">99%</div>
                  <div className="text-xs lg:text-sm xl:text-xs 2xl:text-sm text-slate-400">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl xl:text-xl 2xl:text-xl font-bold text-white">Weekly</div>
                  <div className="text-xs lg:text-sm xl:text-xs 2xl:text-sm text-slate-400">Updates</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="max-w-2xl xl:max-w-xl 2xl:max-w-2xl mx-auto text-center">
            <div className="bg-slate-800/20 backdrop-blur-lg rounded-2xl border border-slate-700/30 p-8 lg:p-12 xl:p-8 2xl:p-10">
              <div className="mb-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 xl:w-16 xl:h-16 2xl:w-18 2xl:h-18 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 lg:w-10 lg:h-10 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-white" />
                </div>
                
                <h2 className="text-2xl lg:text-3xl xl:text-2xl 2xl:text-3xl font-bold text-white mb-3">
                  Đăng Ký Thành Công!
                </h2>
                
                <p className="text-slate-300 text-base lg:text-lg xl:text-base 2xl:text-lg">
                  Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi email xác nhận và những thông tin hữu ích nhất đến bạn.
                </p>
              </div>

              <button
                onClick={() => setIsSubscribed(false)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Đăng ký email khác
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
