"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, Eye, Clock, AlertCircle } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { NotificationType, NotificationCategory } from "@/types/notification";

export function NotificationBell() {
  const { notifications, stats, loading, markAsRead, markAllAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (category: NotificationCategory) => {
    switch (category) {
      case "order_created":
        return "🛒";
      case "order_updated":
        return "📦";
      case "order_delivered":
        return "✅";
      case "order_cancelled":
        return "❌";
      case "payment_success":
        return "💳";
      case "payment_failed":
        return "💳";
      case "admin_new_order":
        return "🛒";
      case "system":
        return "⚙️";
      case "promotion":
        return "🎉";
      default:
        return "📢";
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-50";
      case "error":
        return "border-l-red-500 bg-red-50";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50";
      case "info":
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return "Vừa xong";
    }
  };

  const handleNotificationClick = async (
    notificationId: number,
    isRead: boolean
  ) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />

        {/* Unread Badge */}
        {stats.unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {stats.unread > 99 ? "99+" : stats.unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Thông báo</h3>
              {stats.unread > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Đánh dấu tất cả</span>
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              <span>{stats.total} tổng</span>
              <span className="text-red-600 font-medium">
                {stats.unread} chưa đọc
              </span>
              <span>{stats.recent} hôm nay</span>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto"></div>
                <p className="mt-2 text-sm">Đang tải...</p>
              </div>
            ) : recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  onClick={() =>
                    handleNotificationClick(
                      notification.notification_id,
                      notification.is_read
                    )
                  }
                  className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${getNotificationColor(
                    notification.type
                  )} ${
                    !notification.is_read ? "bg-opacity-80" : "bg-opacity-30"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 text-2xl">
                      {getNotificationIcon(notification.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p
                          className={`text-sm font-medium ${
                            !notification.is_read
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeAgo(notification.created_at)}
                        </span>

                        {notification.is_read && (
                          <span className="text-xs text-gray-400 flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            Đã đọc
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-sm">Chưa có thông báo nào</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {recentNotifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to notifications page
                  window.location.href = "/notifications";
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
