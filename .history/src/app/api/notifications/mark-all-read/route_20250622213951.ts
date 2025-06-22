import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";

export async function PATCH(req: Request) {
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

    // Mark all notifications as read for the user
    const result = await db.update(
      "UPDATE notifications SET is_read = TRUE, updated_at = NOW() WHERE user_id = ? AND is_read = FALSE",
      [userId]
    );

    return NextResponse.json({
      message: "All notifications marked as read",
      updatedCount: result.affectedRows || 0,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
} 