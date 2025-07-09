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

    const offset = (page - 1) * limit;

    // Build query conditions
    let whereConditions = "WHERE user_id = ?";
    let queryParams = [userId];

    if (unreadOnly) {
      whereConditions += " AND is_read = FALSE";
    }

    // Get notifications with pagination
    const notificationsQuery = `
      SELECT 
        notification_id,
        user_id,
        title,
        message,
        type,
        category,
        data,
        is_read,
        created_at,
        updated_at
      FROM notifications 
      ${whereConditions}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;

    const [notifications] = await db.query(notificationsQuery, [
      ...queryParams,
      limit,
      offset,
    ]);

    // Get stats
    const [totalRows] = await db.query(
      "SELECT COUNT(*) as total FROM notifications WHERE user_id = ?",
      [userId]
    );

    const [unreadRows] = await db.query(
      "SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = FALSE",
      [userId]
    );

    const [recentRows] = await db.query(
      "SELECT COUNT(*) as recent FROM notifications WHERE user_id = ? AND DATE(created_at) = CURDATE()",
      [userId]
    );

    const total = (totalRows as any[])[0]?.total || 0;
    const unread = (unreadRows as any[])[0]?.unread || 0;
    const recent = (recentRows as any[])[0]?.recent || 0;

    const response: NotificationResponse = {
      notifications: (notifications as any[]) || [],
      stats: {
        total,
        unread,
        recent,
      },
      pagination: {
        page,
        limit,
        total,
        hasMore: (notifications as any[]).length === limit && total > page * limit,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching notifications:", error);
    } else {
      console.error("Error fetching notifications:", (error as any).message);
    }
    return NextResponse.json(
      { error: "Internal server error" },
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
