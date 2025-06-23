import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";
import { NotificationService } from "@/lib/notificationUtils";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { orderId } = await params;
    console.log("GET /api/orders/[orderId]/status - OrderID:", orderId);

    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user
    const payload = await jwtService.verifyToken(token);
    const user = await db.queryFirst(
      "SELECT user_id FROM users WHERE email = ?",
      [payload.username]
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = user.user_id;

    // Check if order exists and belongs to user (or user is admin)
    let order;
    if (payload.roles.includes("ADMIN")) {
      // Admin can get any order
      order = await db.queryFirst(
        "SELECT id, status FROM orders WHERE id = ?",
        [orderId]
      );
    } else {
      // Regular user can only get their own orders
      order = await db.queryFirst(
        "SELECT id, status FROM orders WHERE id = ? AND user_id = ?",
        [orderId, userId]
      );
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      orderId,
      status: order.status,
    });
  } catch (error) {
    console.error("Error fetching order status:", error);
    return NextResponse.json(
      { error: "Failed to fetch order status" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { orderId } = await params;
    console.log("PUT /api/orders/[orderId]/status - OrderID:", orderId);

    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    console.log("Auth header present:", !!authHeader);
    console.log("Token extracted:", !!token);

    if (!token) {
      console.log("No token provided - returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user
    const payload = await jwtService.verifyToken(token);
    console.log("Token verified, username:", payload.username);

    const user = await db.queryFirst(
      "SELECT user_id FROM users WHERE email = ?",
      [payload.username]
    );

    console.log("User lookup result:", !!user);

    if (!user) {
      console.log("User not found - returning 404");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = user.user_id;
    console.log("User ID:", userId);

    const body = await req.json();
    const { status } = body;
    console.log("Request body status:", status);

    // Validate status
    if (
      !["pending", "paid", "cancelled", "shipped", "delivered"].includes(status)
    ) {
      console.log("Invalid status provided:", status);
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Check if order exists and get current status and customer info
    let order;
    if (payload.roles.includes("ADMIN")) {
      // Admin can update any order
      console.log("User is admin, checking order exists...");
      order = await db.queryFirst(
        "SELECT id, status, user_id FROM orders WHERE id = ?", 
        [orderId]
      );
    } else {
      // Regular user can only update their own orders
      console.log("Regular user, checking order ownership...");
      order = await db.queryFirst(
        "SELECT id, status, user_id FROM orders WHERE id = ? AND user_id = ?",
        [orderId, userId]
      );
    }

    console.log("Order lookup result:", !!order);

    if (!order) {
      console.log("Order not found or doesn't belong to user");
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const previousStatus = order.status;
    const orderUserId = order.user_id;

    // Update order status
    console.log("Updating order status from DB...");
    await db.update(
      "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, orderId]
    );

    // Create notification for customer when status changes (only if different)
    if (previousStatus !== status) {
      try {
        await NotificationService.createOrderStatusNotification(orderUserId, {
          orderId: orderId,
          status: status,
          previousStatus: previousStatus
        });
        console.log(`Order status notification created for order ${orderId}`);
      } catch (notificationError) {
        console.error("Error creating order status notification:", notificationError);
        // Don't fail the status update if notification fails
      }
    }

    console.log("Order status updated successfully");
    return NextResponse.json({
      message: "Order status updated successfully",
      orderId,
      status,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
