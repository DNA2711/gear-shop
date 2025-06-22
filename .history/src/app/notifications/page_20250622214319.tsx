"use client";

import React, { useEffect, useState } from "react";
import { 
  Bell, 
  Package, 
  CheckCheck, 
  Filter, 
  Calendar,
  Clock,
  Truck,
  ShoppingBag,
  AlertCircle
} from "lucide-react";
import { useNotification } from "@/contexts/NotificationContext";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { LoadingLink } from "@/components/ui/LoadingLink";

export default function NotificationsPage() {
  const { 
    notifications, 
    stats, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotification();
  const [filter, setFilter] = useState<"all" | "unread" | "order_status">("all");

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order_status":
        return <Package className="w-6 h-6 text-blue-600" />;
      case "promotion":
        return <ShoppingBag className="w-6 h-6 text-green-600" />;
      case "system":
        return <AlertCircle className="w-6 h-6 text-orange-600" />;
      default:
        return <Bell className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusIcon = (statusTo?: string) => {
    switch (statusTo) {
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-purple-500" />;
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.is_read;
    if (filter === "order_status") return notification.type === "order_status";
    return true;
  });

  const handleNotificationClick = async (notificationId: number, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                <p className="text-gray-600">
                  {stats.total} thông báo • {stats.unread} chưa đọc
                </p>
              </div>
            </div>
            
            {stats.unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Đánh dấu tất cả đã đọc</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "unread"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Chưa đọc ({stats.unread})
            </button>
            <button
              onClick={() => setFilter("order_status")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "order_status"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Đơn hàng ({notifications.filter(n => n.type === "order_status").length})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải thông báo...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === "unread" ? "Không có thông báo chưa đọc" : "Chưa có thông báo"}
              </h3>
              <p className="text-gray-600">
                {filter === "unread" 
                  ? "Bạn đã đọc tất cả thông báo rồi!" 
                  : "Thông báo mới sẽ xuất hiện ở đây"
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all hover:shadow-md ${
                  !notification.is_read ? "ring-2 ring-blue-100 bg-blue-50/30" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-lg font-semibold text-gray-900 ${
                        !notification.is_read ? "text-blue-900" : ""
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {notification.status_to && getStatusIcon(notification.status_to)}
                        {!notification.is_read && (
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{notification.message}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4 text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(notification.created_at), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                          </span>
                        </div>
                        
                        {notification.order_id && (
                          <LoadingLink
                            href={`/orders`}
                            loadingMessage="Đang chuyển đến trang đơn hàng..."
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <Package className="w-4 h-4" />
                            <span>Xem đơn hàng #{notification.order_id}</span>
                          </LoadingLink>
                        )}
                      </div>
                      
                      {notification.status_from && notification.status_to && (
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {notification.status_from} → {notification.status_to}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button (for future pagination) */}
        {filteredNotifications.length > 0 && filteredNotifications.length >= 20 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Tải thêm thông báo
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 