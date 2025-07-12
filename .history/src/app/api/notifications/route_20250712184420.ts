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

    const userId = Number(user.user_id);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unread") === "true";

    if (isNaN(userId) || isNaN(page) || isNaN(limit) || userId <= 0 || page <= 0 || limit <= 0) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const safeLimit = Math.min(Math.max(1, limit), 100);
    const safePage = Math.max(1, page);
    const safeOffset = (safePage - 1) * safeLimit;
    let whereClause = "WHERE user_id = ?";
    if (unreadOnly) {
      whereClause += " AND is_read = FALSE";
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM notifications ${whereClause}`;
    const countParams = [userId];
    const countResult = await db.query(countQuery, countParams);
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

    // Get notifications with pagination - using string interpolation for LIMIT/OFFSET
    const notifQuery = `
      SELECT notification_id, title, message, type, category, is_read, created_at, data
      FROM notifications 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ${safeLimit} OFFSET ${safeOffset}
    `;
    
    // Parameters only for WHERE clause
    const queryParams = [userId];
    
    // Debug info (remove in production)
    if (process.env.NODE_ENV === "development") {
      console.log("Query params - userId:", userId, "limit:", safeLimit, "offset:", safeOffset);
    }
    
    let notifications;
    try {
      notifications = await db.query(notifQuery, queryParams);
    } catch (queryError) {
      console.error("Main query failed, trying fallback:", queryError);
      try {
        // Fallback to raw query (string interpolation instead of parameter binding)
        // Ensure values are safe integers
        const safeUserId = Math.floor(Number(userId));
        const safeLimitInt = Math.floor(Number(safeLimit));
        
        if (safeUserId <= 0 || safeLimitInt <= 0) {
          throw new Error("Invalid fallback parameters");
        }
        
        const fallbackQuery = `SELECT notification_id, title, message, type, category, is_read, created_at, data FROM notifications WHERE user_id = ${safeUserId} ORDER BY created_at DESC LIMIT ${safeLimitInt}`;
        notifications = await db.queryRaw(fallbackQuery);
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        notifications = []; // Return empty array if all queries fail
      }
    }
    
    const notificationsArray = Array.isArray(notifications) ? notifications : [];
    
    const response: NotificationResponse = {
      notifications: notificationsArray,
      stats: {
        total: Number(total),
        unread: Number(unread),
        recent: Number(recent),
      },
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: Number(total),
        hasMore: Number(total) > safePage * safeLimit,
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
