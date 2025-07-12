import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";
import {
  CreateNotificationRequest,
  Notification,
  NotificationResponse,
} from "@/types/notification";

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization");
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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unread") === "true";
    const offset = (page - 1) * limit;

    // Build query conditions
    let whereClause = "WHERE user_id = ?";
    const params = [userId];

    if (unreadOnly) {
      whereClause += " AND is_read = FALSE";
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM notifications ${whereClause}`;
    const countResult = await db.query(countQuery, params);
    const total = countResult[0]?.total || 0;

    // Get unread count
    const unreadResult = await db.query(
      "SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = FALSE", 
      [userId]
    );
    const unread = unreadResult[0]?.unread || 0;

    // Get recent count (today)
    const recentResult = await db.query(
      "SELECT COUNT(*) as recent FROM notifications WHERE user_id = ? AND DATE(created_at) = CURDATE()", 
      [userId]
    );
    const recent = recentResult[0]?.recent || 0;

    // Get notifications with pagination
    const notifQuery = `
      SELECT notification_id, title, message, type, category, is_read, created_at, data
      FROM notifications 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    const queryParams = [...params, limit, offset];
    const notifications = await db.query(notifQuery, queryParams);
    const notificationsArray = Array.isArray(notifications) ? notifications : [];
    
    const response: NotificationResponse = {
      notifications: notificationsArray,
      stats: {
        total: Number(total),
        unread: Number(unread),
        recent: Number(recent),
      },
      pagination: {
        page,
        limit,
        total: Number(total),
        hasMore: Number(total) > page * limit,
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
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
