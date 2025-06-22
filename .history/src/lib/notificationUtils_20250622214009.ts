import { db } from "./database";

export const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    pending: "Chờ thanh toán",
    paid: "Đã thanh toán",
    processing: "Đang xử lý",
    shipped: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
  };
  return statusMap[status] || status;
};

export const createOrderStatusNotification = async (
  userId: number,
  orderId: number,
  fromStatus: string,
  toStatus: string
) => {
  try {
    const fromStatusText = getStatusText(fromStatus);
    const toStatusText = getStatusText(toStatus);

    let title = "";
    let message = "";

    // Customize notification based on status change
    switch (toStatus) {
      case "processing":
        title = "Đơn hàng đang được xử lý";
        message = `Đơn hàng #${orderId} của bạn đã được xác nhận và đang trong quá trình xử lý. Chúng tôi sẽ sớm chuẩn bị hàng và giao đến bạn.`;
        break;
      case "shipped":
        title = "Đơn hàng đang được giao";
        message = `Đơn hàng #${orderId} của bạn đã được giao cho đơn vị vận chuyển và đang trên đường đến địa chỉ của bạn. Vui lòng chú ý điện thoại để nhận hàng.`;
        break;
      case "delivered":
        title = "Đơn hàng đã được giao thành công";
        message = `Đơn hàng #${orderId} của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi!`;
        break;
      case "cancelled":
        title = "Đơn hàng đã bị hủy";
        message = `Đơn hàng #${orderId} của bạn đã bị hủy. Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi để được hỗ trợ.`;
        break;
      default:
        title = "Trạng thái đơn hàng đã thay đổi";
        message = `Đơn hàng #${orderId} của bạn đã được cập nhật từ "${fromStatusText}" thành "${toStatusText}".`;
    }

    // Insert notification into database
    const notificationId = await db.insert(
      `INSERT INTO notifications (user_id, order_id, type, title, message, status_from, status_to)
       VALUES (?, ?, 'order_status', ?, ?, ?, ?)`,
      [userId, orderId, title, message, fromStatus, toStatus]
    );

    console.log(
      `Created notification ${notificationId} for user ${userId}, order ${orderId}: ${fromStatus} -> ${toStatus}`
    );

    return notificationId;
  } catch (error) {
    console.error("Error creating order status notification:", error);
    throw error;
  }
}; 