import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("user_id");

    let userId: number;
    if (userIdParam) {
      userId = parseInt(userIdParam);
    } else {
      userId = 8;
    }

    const notificationId = parseInt(resolvedParams.id);
    if (isNaN(notificationId)) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 }
      );
    }

    const checkQuery = `
      SELECT notification_id FROM notifications 
      WHERE notification_id = ? AND user_id = ?
    `;
    const [notification] = await db.query(checkQuery, [notificationId, userId]);

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    const updateQuery = `
      UPDATE notifications 
      SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE notification_id = ? AND user_id = ?
    `;

    await db.query(updateQuery, [notificationId, userId]);

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
        console.error("Error marking notification as read:", error);
    } else {
      console.error("Error marking notification as read:", (error as any).message);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
