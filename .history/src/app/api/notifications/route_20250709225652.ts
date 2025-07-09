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
    const userIdParam = searchParams.get("user_id");
    const userId = userIdParam ? parseInt(userIdParam) : 8;

    console.log("🔔 API Request - userId:", userId);

    // Step 1: Test basic count
    const [countResult] = await db.query(
      "SELECT COUNT(*) as total FROM notifications WHERE user_id = ?", 
      [userId]
    );
    const total = countResult?.[0]?.total || 0;
    console.log("📊 Total notifications:", total);

    // Step 2: Get unread count
    const [unreadResult] = await db.query(
      "SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = FALSE", 
      [userId]
    );
    const unread = unreadResult?.[0]?.unread || 0;
    console.log("🔔 Unread notifications:", unread);

    // Step 3: Get first 5 notifications
    const [notifications] = await db.query(
      "SELECT notification_id, title, message, type, category, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
      [userId]
    );
    console.log("📝 Notifications fetched:", Array.isArray(notifications), notifications?.length);

    if (Array.isArray(notifications) && notifications.length > 0) {
      console.log("📋 First notification:", notifications[0]?.title);
    }

    const notificationsArray = Array.isArray(notifications) ? notifications : [];
    
    const response = {
      notifications: notificationsArray,
      stats: {
        total: Number(total),
        unread: Number(unread),
        recent: 0,
      },
      pagination: {
        page: 1,
        limit: 5,
        total: Number(total),
        hasMore: false,
      },
    };

    console.log("✅ Sending response with", response.notifications.length, "notifications");
    return NextResponse.json(response);

  } catch (error) {
    console.error("❌ Detailed error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: (error as any).message,
        stack: (error as any).stack?.split('\n').slice(0, 5)
      },
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
