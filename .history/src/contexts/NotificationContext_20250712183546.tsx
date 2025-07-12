"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  Notification,
  NotificationResponse,
  NotificationStats,
} from "@/types/notification";

interface NotificationContextType {
  notifications: Notification[];
  stats: NotificationStats;
  loading: boolean;
  fetchNotifications: (page?: number, unreadOnly?: boolean) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  hasMore: boolean;
  currentPage: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    recent: 0,
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchNotifications = async (page = 1, unreadOnly = false) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/notifications?page=${page}&limit=20&unread=${unreadOnly}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data: NotificationResponse = await response.json();

        if (page === 1) {
          setNotifications(data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
        }

        setStats(data.stats);
        setHasMore(data.pagination?.hasMore || false);
        setCurrentPage(page);
      } else if (response.status === 401) {
        console.warn("Unauthorized access to notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.notification_id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );

        setStats((prev) => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
        }));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/notifications/mark-all-read`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, is_read: true }))
        );

        setStats((prev) => ({
          ...prev,
          unread: 0,
        }));
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const refreshUnreadCount = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/notifications?page=1&limit=1`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data: NotificationResponse = await response.json();
        setStats(data.stats);

        if (data.stats.unread > stats.unread) {
          fetchNotifications(1);
        }
      }
    } catch (error) {
      console.error("Error refreshing unread count:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setStats({ total: 0, unread: 0, recent: 0 });
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      refreshUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id, stats.unread]);

  useEffect(() => {
    const handleFocus = () => {
      if (user?.id) {
        refreshUnreadCount();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user?.id]);

  const contextValue: NotificationContextType = {
    notifications,
    stats,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    refreshUnreadCount,
    hasMore,
    currentPage,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
