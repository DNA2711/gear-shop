import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";
import { CreateNotificationRequest } from "@/types/notification";

export async function GET(req: Request) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization");
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

    // Get URL search params for pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const onlyUnread = url.searchParams.get("unread") === "true";
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = "WHERE user_id = ?";
    const params = [userId];

    if (onlyUnread) {
      whereClause += " AND is_read = FALSE";
    }

    // Get notifications
    const notifications = await db.query(
      `SELECT id, user_id, order_id, type, title, message, 
              status_from, status_to, is_read, created_at, updated_at
       FROM notifications 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const countResult = await db.queryFirst(
      `SELECT COUNT(*) as total FROM notifications ${whereClause}`,
      params
    );
    const total = countResult?.total || 0;

    // Get unread count
    const unreadResult = await db.queryFirst(
      "SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = FALSE",
      [userId]
    );
    const unread = unreadResult?.unread || 0;

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total,
        unread,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and check if user is admin (for creating notifications)
    const payload = await jwtService.verifyToken(token);
    const user = await db.queryFirst(
      "SELECT user_id, role FROM users WHERE email = ?",
      [payload.username]
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only admin can create notifications manually
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body: CreateNotificationRequest = await req.json();
    const { user_id, order_id, type, title, message, status_from, status_to } =
      body;

    // Create notification
    const notificationId = await db.insert(
      `INSERT INTO notifications (user_id, order_id, type, title, message, status_from, status_to)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, order_id, type, title, message, status_from, status_to]
    );

    return NextResponse.json({
      message: "Notification created successfully",
      notificationId,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
