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

    console.log("📝 Mark all read - userId:", userId);

    const updateQuery = `
      UPDATE notifications 
      SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND is_read = FALSE
    `;

    const result = await db.query(updateQuery, [userId]);
    console.log("✅ Update result:", result);

    // For UPDATE queries, we need to use the update method to get affectedRows
    const affectedRows = await db.update(updateQuery, [userId]);
    console.log("📊 Affected rows:", affectedRows);

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: affectedRows,
    });
  } catch (error) {
    console.error("❌ Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
