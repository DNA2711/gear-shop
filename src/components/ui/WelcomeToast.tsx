"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X, Sparkles } from "lucide-react";
import { getGreetingName } from "@/utils/userUtils";

interface WelcomeToastProps {
  user?: {
    name?: string;
    email?: string;
  };
  onClose: () => void;
}

export function WelcomeToast({ user, onClose }: WelcomeToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg shadow-lg max-w-md flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-yellow-300" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-white">Chào mừng trở lại! 🎉</h3>
          <p className="text-sm text-green-100 mt-1">
            Xin chào <strong>{getGreetingName(user)}</strong>, bạn đã đăng nhập
            thành công!
          </p>
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
