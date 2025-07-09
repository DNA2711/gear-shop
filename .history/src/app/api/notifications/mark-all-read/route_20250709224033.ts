import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("user_id");

    let userId: number;
    if (userIdParam) {
      userId = parseInt(userIdParam);
    } else {
      userId = 8; // Default fallback user ID
    }

    // Update all unread notifications to read for this user
    const updateQuery = `
      UPDATE notifications 
      SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND is_read = FALSE
    `;

    const [result] = await db.query(updateQuery, [userId]);

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: (result as any)?.affectedRows || 0,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error marking all notifications as read:", error);
    } else {
      console.error(
        "Error marking all notifications as read:",
        (error as any).message
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
