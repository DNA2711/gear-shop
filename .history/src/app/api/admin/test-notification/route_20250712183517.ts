import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";
import { NotificationService } from "@/lib/notificationUtils";

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
    
    // Check if user is admin
    if (!payload.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, orderId, status } = body;

    if (!userId || !orderId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: userId, orderId, status" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Check if user exists
    const user = await db.queryFirst(
      "SELECT user_id, full_name FROM users WHERE user_id = ?",
      [userId]
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create test notification
    const result = await NotificationService.createOrderStatusNotification(userId, {
      orderId: orderId,
      status: status,
      previousStatus: "pending",
    });

    return NextResponse.json({
      success: true,
      message: `Test notification created successfully for user ${user.full_name}`,
      result: result,
    });

  } catch (error) {
    console.error("Error creating test notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 