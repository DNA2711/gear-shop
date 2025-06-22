export interface Notification {
  id: number;
  user_id: number;
  order_id?: number;
  type: "order_status" | "promotion" | "system" | "general";
  title: string;
  message: string;
  status_from?: string;
  status_to?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationRequest {
  user_id: number;
  order_id?: number;
  type: Notification["type"];
  title: string;
  message: string;
  status_from?: string;
  status_to?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
}
