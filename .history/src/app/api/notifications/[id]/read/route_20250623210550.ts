import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { verifyJWT } from "@/lib/jwt";

// PUT - Đánh dấu thông báo đã đọc
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const notificationId = parseInt(params.id);
    if (isNaN(notificationId)) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 }
      );
    }

    // Check if notification exists and belongs to user
    const checkQuery = `
      SELECT notification_id FROM notifications 
      WHERE notification_id = ? AND user_id = ?
    `;
    const [notification] = await db.query(checkQuery, [notificationId, decoded.userId]);

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    // Update notification as read
    const updateQuery = `
      UPDATE notifications 
      SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE notification_id = ? AND user_id = ?
    `;
    
    await db.query(updateQuery, [notificationId, decoded.userId]);

    return NextResponse.json({
      success: true,
      message: "Notification marked as read"
    });

  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 