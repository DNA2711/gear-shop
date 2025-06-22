import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await params;

    // Check if notification belongs to user
    const notification = await db.queryFirst(
      "SELECT id, user_id FROM notifications WHERE id = ?",
      [id]
    );

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    if (notification.user_id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to notification" },
        { status: 403 }
      );
    }

    // Mark notification as read
    await db.update(
      "UPDATE notifications SET is_read = TRUE, updated_at = NOW() WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      message: "Notification marked as read",
      notificationId: id,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
} 