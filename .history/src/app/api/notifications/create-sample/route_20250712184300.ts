import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization");
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

    // Create sample notifications
    const sampleNotifications = [
      {
        title: "🎉 Chào mừng!",
        message: "Chào mừng bạn đến với Gear Shop! Khám phá các sản phẩm công nghệ tuyệt vời.",
        type: "success",
        category: "system"
      },
      {
        title: "🛒 Đơn hàng test",
        message: "Đây là thông báo test cho đơn hàng #12345",
        type: "info",
        category: "order_created"
      },
      {
        title: "💳 Thanh toán thành công",
        message: "Đơn hàng #12345 đã được thanh toán thành công",
        type: "success",
        category: "payment_success"
      }
    ];

    const results = [];
    for (const notif of sampleNotifications) {
      const insertId = await db.insert(
        "INSERT INTO notifications (user_id, title, message, type, category, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
        [userId, notif.title, notif.message, notif.type, notif.category]
      );
      results.push({ ...notif, notification_id: insertId });
    }

    return NextResponse.json({
      success: true,
      message: `Created ${results.length} sample notifications for user ${userId}`,
      notifications: results
    });

  } catch (error) {
    console.error("Error creating sample notifications:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 