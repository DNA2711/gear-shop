import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { verifyJWT } from "@/lib/jwt";

// PUT - Đánh dấu thông báo đã đọc
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    // Get user_id from query params or default to admin user
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("user_id");
    
    let userId: number;
    if (userIdParam) {
      userId = parseInt(userIdParam);
    } else {
      // Default to admin user (ID: 8) for demo
      userId = 8;
    }

    const notificationId = parseInt(resolvedParams.id);
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
    const [notification] = await db.query(checkQuery, [
      notificationId,
      user.user_id,
    ]);

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

    await db.query(updateQuery, [notificationId, user.user_id]);

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
