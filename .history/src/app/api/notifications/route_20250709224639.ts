import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import {
  CreateNotificationRequest,
  Notification,
  NotificationResponse,
} from "@/types/notification";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unread") === "true";
    const userIdParam = searchParams.get("user_id");

    let userId: number;
    if (userIdParam) {
      userId = parseInt(userIdParam);
    } else {
      userId = 8; // Default fallback user ID
    }

    console.log("API Request - userId:", userId, "page:", page, "limit:", limit, "unreadOnly:", unreadOnly);

    const offset = (page - 1) * limit;

    // Simple test query first
    const testQuery = "SELECT COUNT(*) as count FROM notifications WHERE user_id = ?";
    const [testResult] = await db.query(testQuery, [userId]);
    console.log("Test query result:", testResult);

    // Get notifications with pagination
    const notificationsQuery = `
      SELECT 
        notification_id,
        user_id,
        title,
        message,
        type,
        category,
        is_read,
        created_at
      FROM notifications 
      WHERE user_id = ?
      ${unreadOnly ? 'AND is_read = FALSE' : ''}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;

    const queryParams = unreadOnly 
      ? [userId, limit, offset]
      : [userId, limit, offset];

    console.log("Executing query:", notificationsQuery);
    console.log("Query params:", queryParams);

    const [notifications] = await db.query(notificationsQuery, queryParams);
    console.log("Notifications result:", Array.isArray(notifications), notifications?.length);

    // Get stats with simple queries
    const [totalResult] = await db.query(
      "SELECT COUNT(*) as total FROM notifications WHERE user_id = ?",
      [userId]
    );

    const [unreadResult] = await db.query(
      "SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = FALSE",
      [userId]
    );

    const total = totalResult?.[0]?.total || 0;
    const unread = unreadResult?.[0]?.unread || 0;

    console.log("Stats - total:", total, "unread:", unread);

    const response: NotificationResponse = {
      notifications: (notifications as any[]) || [],
      stats: {
        total: parseInt(total.toString()),
        unread: parseInt(unread.toString()),
        recent: 0, // Simplified for now
      },
      pagination: {
        page,
        limit,
        total: parseInt(total.toString()),
        hasMore: (notifications as any[]).length === limit,
      },
    };

    console.log("Sending response:", response.stats);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as any).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateNotificationRequest = await request.json();
    const { user_id, title, message, type, category, data } = body;

    if (!user_id || !title || !message || !type || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO notifications (user_id, title, message, type, category, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const insertId = await db.insert(insertQuery, [
      user_id,
      title,
      message,
      type,
      category,
      data ? JSON.stringify(data) : null,
    ]);

    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
      notification_id: insertId,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating notification:", error);
    } else {
      console.error("Error creating notification:", (error as any).message);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
