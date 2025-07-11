"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Bell,
  Filter,
  CheckCheck,
  RotateCcw,
  Calendar,
  Eye,
  Trash2,
} from "lucide-react";
import { NotificationCategory, NotificationType } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function NotificationsPage() {
  const { user } = useAuth();
  const {
    notifications,
    stats,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    hasMore,
    currentPage,
  } = useNotifications();

  const [filter, setFilter] = useState<{
    category?: NotificationCategory;
    type?: NotificationType;
    unreadOnly: boolean;
  }>({
    unreadOnly: false,
  });

  useEffect(() => {
    if (user) {
      fetchNotifications(1, filter.unreadOnly);
    }
  }, [user, filter.unreadOnly]);

  const getNotificationIcon = (category: NotificationCategory) => {
    const iconMap = {
      order_created: "🛒",
      order_updated: "📦",
      order_delivered: "✅",
      order_cancelled: "❌",
      payment_success: "💳",
      payment_failed: "💳",
      admin_new_order: "🛒",
      system: "⚙️",
      promotion: "🎉",
    };
    return iconMap[category] || "📢";
  };

  const getNotificationColor = (type: NotificationType) => {
    const colorMap = {
      success: "border-l-green-500 bg-green-50",
      error: "border-l-red-500 bg-red-50",
      warning: "border-l-yellow-500 bg-yellow-50",
      info: "border-l-blue-500 bg-blue-50",
    };
    return colorMap[type] || colorMap.info;
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

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchNotifications(currentPage + 1, filter.unreadOnly);
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

  const filteredNotifications = notifications.filter((notification) => {
    if (filter.category && notification.category !== filter.category)
      return false;
    if (filter.type && notification.type !== filter.type) return false;
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Bell className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">Bạn cần đăng nhập để xem thông báo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
            <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thông báo</h1>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stats.total}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Tổng số</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-red-600">
                  {stats.unread}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Chưa đọc</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {stats.recent}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Hôm nay</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <button
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    unreadOnly: !prev.unreadOnly,
                  }))
                }
                className={`px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm sm:text-base ${
                  filter.unreadOnly
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                {filter.unreadOnly ? "Tất cả" : "Chưa đọc"}
              </button>

              <button
                onClick={() => fetchNotifications(1, filter.unreadOnly)}
                disabled={loading}
                className="px-3 sm:px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <RotateCcw
                  className={`w-3 h-3 sm:w-4 sm:h-4 inline mr-2 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                Làm mới
              </button>
            </div>

            {stats.unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Đánh dấu tất cả đã đọc</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {loading && notifications.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Đang tải thông báo...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={`page-${notification.notification_id}`}
                onClick={() =>
                  handleNotificationClick(
                    notification.notification_id,
                    notification.is_read
                  )
                }
                className={`bg-white rounded-lg shadow border-l-4 cursor-pointer hover:shadow-md transition-all ${getNotificationColor(
                  notification.type
                )} ${
                  !notification.is_read ? "bg-opacity-80" : "bg-opacity-30"
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 text-2xl sm:text-3xl">
                      {getNotificationIcon(notification.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2 sm:gap-0">
                        <h3
                          className={`text-base sm:text-lg font-semibold ${
                            !notification.is_read
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {!notification.is_read && (
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                          )}
                          <span className="text-xs sm:text-sm text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {formatTimeAgo(notification.created_at)}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3 leading-relaxed text-sm sm:text-base">
                        {notification.message}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                          <span className="capitalize">
                            {notification.type}
                          </span>
                          <span>•</span>
                          <span>
                            {notification.category.replace(/_/g, " ")}
                          </span>
                        </div>

                        {notification.is_read && (
                          <span className="text-xs sm:text-sm text-gray-400 flex items-center">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            Đã đọc
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow">
              <Bell className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {filter.unreadOnly
                  ? "Không có thông báo chưa đọc"
                  : "Chưa có thông báo nào"}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {filter.unreadOnly
                  ? "Tất cả thông báo đã được đọc rồi!"
                  : "Khi có thông báo mới, chúng sẽ hiển thị ở đây"}
              </p>
            </div>
          )}
        </div>

        {hasMore && (
          <div className="text-center mt-6 sm:mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                  <span>Đang tải...</span>
                </div>
              ) : (
                "Tải thêm"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
