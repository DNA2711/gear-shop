"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Notification, NotificationStats } from "@/types/notification";

interface NotificationContextType {
  notifications: Notification[];
  stats: NotificationStats;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setStats(data.stats || { total: 0, unread: 0 });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch("/api/notifications?limit=1", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || { total: 0, unread: 0 });
      }
    } catch (error) {
      console.error("Error refreshing notification stats:", error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? { ...notification, is_read: true }
              : notification
          )
        );
        await refreshStats();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, is_read: true }))
        );
        setStats((prev) => ({ ...prev, unread: 0 }));
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      refreshStats(); // Initial load
      const interval = setInterval(refreshStats, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        stats,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        refreshStats,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
