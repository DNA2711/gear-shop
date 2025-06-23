export interface Notification {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  data?: any; // Additional data (order_id, etc.)
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 
  | "success" 
  | "info" 
  | "warning" 
  | "error";

export type NotificationCategory = 
  | "order_created"
  | "order_updated" 
  | "order_cancelled"
  | "order_delivered"
  | "payment_success"
  | "payment_failed"
  | "admin_new_order"
  | "system"
  | "promotion";

export interface CreateNotificationRequest {
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  data?: any;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newProducts: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  recent: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  stats: NotificationStats;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
} 