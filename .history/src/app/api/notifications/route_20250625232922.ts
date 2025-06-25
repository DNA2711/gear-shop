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
    // For demo purposes, return empty notifications since table is empty
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const response: NotificationResponse = {
      notifications: [],
      stats: {
        total: 0,
        unread: 0,
        recent: 0,
      },
      pagination: {
        page,
        limit,
        total: 0,
        hasMore: false,
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
