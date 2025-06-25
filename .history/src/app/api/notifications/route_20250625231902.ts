import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import {
  CreateNotificationRequest,
  Notification,
  NotificationResponse,
} from "@/types/notification";

// GET - Lấy danh sách thông báo của user
export async function GET(request: NextRequest) {
  try {
    // For demo purposes, use user_id from query params or default to admin user
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("user_id");

    let userId: number;
    if (userIdParam) {
      userId = parseInt(userIdParam);
    } else {
      // Default to admin user (ID: 8) for demo
      userId = 8;
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unread") === "true";
    const category = searchParams.get("category");

    const offset = (page - 1) * limit;

    // Build query conditions
    let conditions = ["user_id = ?"];
    let whereParams: any[] = [userId];

    if (unreadOnly) {
      conditions.push("is_read = FALSE");
    }

    if (category) {
      conditions.push("category = ?");
      whereParams.push(category);
    }

    const whereClause = conditions.join(" AND ");

    // Get notifications
    const notificationsQuery = `
      SELECT * FROM notifications 
      WHERE ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    const notificationParams = [...whereParams, limit, offset];

    const notifications = await db.query(
      notificationsQuery,
      notificationParams
    );

    // Get stats
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        COALESCE(SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END), 0) as unread,
        COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 ELSE 0 END), 0) as recent
      FROM notifications 
      WHERE user_id = ?
    `;
    const statsResult = await db.query(statsQuery, [userId]);
    const stats = statsResult[0] || { total: 0, unread: 0, recent: 0 };

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM notifications 
      WHERE ${whereClause}
    `;
    const countResult = await db.query(countQuery, whereParams);
    const totalCount = countResult[0]?.total || 0;

    const response: NotificationResponse = {
      notifications: notifications as Notification[],
      stats: {
        total: stats.total || 0,
        unread: stats.unread || 0,
        recent: stats.recent || 0,
      },
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: offset + notifications.length < totalCount,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Tạo thông báo mới
export async function POST(request: NextRequest) {
  try {
    // Remove authentication check for demo purposes

    const body: CreateNotificationRequest = await request.json();
    const { user_id, title, message, type, category, data } = body;

    // Validate required fields
    if (!user_id || !title || !message || !type || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert notification
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
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
