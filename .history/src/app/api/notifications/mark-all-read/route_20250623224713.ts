import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { verifyJWT } from "@/lib/jwt";

// PUT - Đánh dấu tất cả thông báo đã đọc
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get user_id from username
    const user = await db.queryFirst(
      "SELECT user_id FROM users WHERE email = ?",
      [decoded.username]
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update all unread notifications as read
    const updateQuery = `
      UPDATE notifications 
      SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND is_read = FALSE
    `;

    const affectedRows = await db.update(updateQuery, [user.user_id]);

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
      updated_count: affectedRows,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
