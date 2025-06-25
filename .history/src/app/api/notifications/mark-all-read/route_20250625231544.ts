import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { verifyJWT } from "@/lib/jwt";

// PUT - Đánh dấu tất cả thông báo đã đọc
export async function PUT(request: NextRequest) {
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
