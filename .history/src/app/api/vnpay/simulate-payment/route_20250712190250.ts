import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { NotificationService } from "@/lib/notificationUtils";

export async function POST(request: Request) {
  // Allow simulation in production for demo mode
  const IS_DEMO_MODE =
    process.env.VNPAY_TMN_CODE === "DEMO" ||
    process.env.VNPAY_SECRET_KEY === "DEMO_SECRET";

  if (process.env.NODE_ENV === "production" && !IS_DEMO_MODE) {
    return NextResponse.json(
      { error: "This endpoint is only available in development or demo mode" },
      { status: 403 }
    );
  }

  try {
    const { orderId, status = "paid" } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await db.queryFirst(
      "SELECT id, status FROM orders WHERE id = ?",
      [orderId]
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let orderStatus;

    if (status === "paid") {
      orderStatus = "paid";
    } else if (status === "failed") {
      orderStatus = "cancelled";
    } else {
      orderStatus = status;
    }

    await db.update(
      "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
      [orderStatus, orderId]
    );

    if (status === "paid") {
      try {
        const orderDetails = await db.queryFirst(
          "SELECT o.user_id, o.total_amount, u.full_name, COUNT(oi.id) as items_count FROM orders o LEFT JOIN users u ON o.user_id = u.user_id LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.id = ? GROUP BY o.id",
          [orderId]
        );

        if (orderDetails) {
          await NotificationService.createOrderSuccessNotification(
            orderDetails.user_id,
            {
              orderId: parseInt(orderId),
              totalAmount: orderDetails.total_amount,
              itemsCount: orderDetails.items_count,
            }
          );

          await NotificationService.createNewOrderNotificationForAdmin({
            orderId: parseInt(orderId),
            customerName: orderDetails.full_name,
            customerId: orderDetails.user_id,
            totalAmount: orderDetails.total_amount,
            itemsCount: orderDetails.items_count,
          });

          console.log(
            `Payment simulated successfully! Notifications created for order ${orderId}`
          );
        }
      } catch (notificationError) {
        console.error(
          "Error creating notifications after simulated payment:",
          notificationError
        );
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: orderStatus,
      message: `Order ${orderId} updated: status=${orderStatus}`,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error simulating payment:", error);
    } else {
      console.error("Error simulating payment:", (error as any).message);
    }
    return NextResponse.json(
      { error: "Failed to simulate payment" },
      { status: 500 }
    );
  }
}
