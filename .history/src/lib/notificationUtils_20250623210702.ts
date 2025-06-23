import { db } from "@/lib/database";
import {
  CreateNotificationRequest,
  NotificationCategory,
  NotificationType,
} from "@/types/notification";

export class NotificationService {
  // Tạo thông báo cho khách hàng khi đặt hàng thành công
  static async createOrderSuccessNotification(userId: number, orderData: any) {
    try {
      const notification: CreateNotificationRequest = {
        user_id: userId,
        title: "🎉 Đặt hàng thành công!",
        message: `Đơn hàng #${
          orderData.orderId
        } của bạn đã được đặt thành công với tổng giá trị ${formatPrice(
          orderData.totalAmount
        )}. Chúng tôi sẽ xử lý đơn hàng và thông báo cập nhật cho bạn sớm nhất.`,
        type: "success" as NotificationType,
        category: "order_created" as NotificationCategory,
        data: {
          order_id: orderData.orderId,
          total_amount: orderData.totalAmount,
          items_count: orderData.itemsCount,
        },
      };

      return await this.createNotification(notification);
    } catch (error) {
      console.error("Error creating order success notification:", error);
      throw error;
    }
  }

  // Tạo thông báo cho khách hàng khi trạng thái đơn hàng thay đổi
  static async createOrderStatusNotification(userId: number, orderData: any) {
    try {
      let title = "";
      let message = "";
      let type: NotificationType = "info";
      let category: NotificationCategory = "order_updated";

      switch (orderData.status) {
        case "paid":
          title = "💳 Thanh toán thành công";
          message = `Đơn hàng #${orderData.orderId} đã được thanh toán thành công. Chúng tôi đang chuẩn bị đóng gói sản phẩm cho bạn.`;
          type = "success";
          category = "payment_success";
          break;
        case "processing":
          title = "📦 Đang xử lý đơn hàng";
          message = `Đơn hàng #${orderData.orderId} đang được xử lý. Chúng tôi sẽ thông báo khi đơn hàng được giao cho đơn vị vận chuyển.`;
          type = "info";
          break;
        case "shipped":
          title = "🚚 Đơn hàng đã được giao vận chuyển";
          message = `Đơn hàng #${orderData.orderId} đã được giao cho đơn vị vận chuyển. Bạn có thể theo dõi đơn hàng qua mã vận đơn.`;
          type = "info";
          break;
        case "delivered":
          title = "✅ Giao hàng thành công";
          message = `Đơn hàng #${orderData.orderId} đã được giao thành công. Cảm ơn bạn đã mua sắm tại Gear Shop!`;
          type = "success";
          category = "order_delivered";
          break;
        case "cancelled":
          title = "❌ Đơn hàng đã bị hủy";
          message = `Đơn hàng #${orderData.orderId} đã bị hủy. Nếu bạn đã thanh toán, số tiền sẽ được hoàn lại trong 3-5 ngày làm việc.`;
          type = "warning";
          category = "order_cancelled";
          break;
        default:
          title = "📋 Cập nhật đơn hàng";
          message = `Đơn hàng #${orderData.orderId} có cập nhật mới. Vui lòng kiểm tra chi tiết đơn hàng.`;
      }

      const notification: CreateNotificationRequest = {
        user_id: userId,
        title,
        message,
        type,
        category,
        data: {
          order_id: orderData.orderId,
          status: orderData.status,
          previous_status: orderData.previousStatus,
        },
      };

      return await this.createNotification(notification);
    } catch (error) {
      console.error("Error creating order status notification:", error);
      throw error;
    }
  }

  // Tạo thông báo cho admin khi có đơn hàng mới
  static async createNewOrderNotificationForAdmin(orderData: any) {
    try {
      // Lấy danh sách admin users
      const adminQuery = "SELECT user_id FROM users WHERE role = 'admin'";
      const admins = await db.query(adminQuery, []);

      const notifications = admins.map((admin: any) => ({
        user_id: admin.user_id,
        title: "🛒 Đơn hàng mới!",
        message: `Có đơn hàng mới #${orderData.orderId} từ khách hàng ${
          orderData.customerName
        } với giá trị ${formatPrice(
          orderData.totalAmount
        )}. Vui lòng kiểm tra và xử lý.`,
        type: "info" as NotificationType,
        category: "admin_new_order" as NotificationCategory,
        data: {
          order_id: orderData.orderId,
          customer_name: orderData.customerName,
          total_amount: orderData.totalAmount,
          items_count: orderData.itemsCount,
          customer_id: orderData.customerId,
        },
      }));

      // Tạo thông báo cho tất cả admin
      const promises = notifications.map((notification) =>
        this.createNotification(notification)
      );

      return await Promise.all(promises);
    } catch (error) {
      console.error("Error creating admin notifications:", error);
      throw error;
    }
  }

  // Tạo thông báo thanh toán thất bại
  static async createPaymentFailedNotification(userId: number, orderData: any) {
    try {
      const notification: CreateNotificationRequest = {
        user_id: userId,
        title: "❌ Thanh toán thất bại",
        message: `Thanh toán cho đơn hàng #${orderData.orderId} đã thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề tiếp tục xảy ra.`,
        type: "error",
        category: "payment_failed",
        data: {
          order_id: orderData.orderId,
          error_code: orderData.errorCode,
          error_message: orderData.errorMessage,
        },
      };

      return await this.createNotification(notification);
    } catch (error) {
      console.error("Error creating payment failed notification:", error);
      throw error;
    }
  }

  // Function cơ bản để tạo notification trong database
  private static async createNotification(
    notification: CreateNotificationRequest
  ) {
    try {
      const insertQuery = `
        INSERT INTO notifications (user_id, title, message, type, category, data)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const result = await db.query(insertQuery, [
        notification.user_id,
        notification.title,
        notification.message,
        notification.type,
        notification.category,
        notification.data ? JSON.stringify(notification.data) : null,
      ]);

      return {
        success: true,
        notification_id: result.insertId,
      };
    } catch (error) {
      console.error("Error inserting notification:", error);
      throw error;
    }
  }

  // Utility: Lấy số lượng thông báo chưa đọc của user
  static async getUnreadCount(userId: number): Promise<number> {
    try {
      const query = `
        SELECT COUNT(*) as unread_count 
        FROM notifications 
        WHERE user_id = ? AND is_read = FALSE
      `;
      const [result] = await db.query(query, [userId]);
      return result?.unread_count || 0;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }
}

// Helper function for formatting price
function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
