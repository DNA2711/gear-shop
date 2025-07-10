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
      userId = 8;
    }

    const updateQuery = `
      UPDATE notifications 
      SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND is_read = FALSE
    `;

    const affectedRows = await db.update(updateQuery, [userId]);

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: affectedRows,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
