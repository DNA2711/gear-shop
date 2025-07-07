import React from "react";
import { UserCircle } from "lucide-react";

interface UserAvatarProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
}

export function UserAvatar({
  user,
  size = "md",
  showStatus = false,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const getInitials = (name?: string, email?: string) => {
    if (name && name.length > 0) {
      const words = name
        .trim()
        .split(" ")
        .filter((word) => word.length > 0);
      if (words.length >= 2) {
        // Lấy chữ cái đầu của tên và họ
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
      } else if (words.length === 1) {
        // Nếu chỉ có một từ, lấy 2 chữ cái đầu
        return words[0].substring(0, 2).toUpperCase();
      }
    }
    if (email) {
      const username = email.split("@")[0];
      return username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getAvatarColor = (text: string) => {
    // Generate consistent color based on text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  if (user?.avatar) {
    return (
      <div className="relative">
        <img
          src={user.avatar}
          alt={user.name || user.email || "User"}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-blue-400`}
        />
        {showStatus && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
        )}
      </div>
    );
  }

  const initials = getInitials(user?.name, user?.email);
  const bgColor = getAvatarColor(user?.name || user?.email || "User");

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white border-2 border-blue-400`}
        style={{ backgroundColor: bgColor }}
      >
        {initials}
      </div>
      {showStatus && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
}
