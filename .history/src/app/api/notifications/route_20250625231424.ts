import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { verifyJWT } from "@/lib/jwt";
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unread") === "true";
    const category = searchParams.get("category");

    const offset = (page - 1) * limit;
    const userId = user.user_id;

    // Build query conditions
    let conditions = ["user_id = ?"];
    let params: any[] = [userId];

    if (unreadOnly) {
      conditions.push("is_read = FALSE");
    }

    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }

    const whereClause = conditions.join(" AND ");

    // Get notifications
    const notificationsQuery = `
      SELECT * FROM notifications 
      WHERE ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    params.push(limit, offset);

    const notifications = await db.query(notificationsQuery, params);

    // Get stats
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) as unread,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 ELSE 0 END) as recent
      FROM notifications 
      WHERE user_id = ?
    `;
    const [stats] = await db.query(statsQuery, [userId]);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM notifications 
      WHERE ${whereClause.replace(/LIMIT.*/, "")}
    `;
    const [countResult] = await db.query(countQuery, params.slice(0, -2));

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
        total: countResult.total || 0,
        hasMore: offset + notifications.length < (countResult.total || 0),
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

// POST - Tạo thông báo mới (chỉ admin hoặc system)
export async function POST(request: NextRequest) {
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

    // Check if user is admin (for manual notifications)
    if (!decoded.roles.includes("ADMIN")) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

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
