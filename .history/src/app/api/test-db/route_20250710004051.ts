import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    console.log("Testing database connection...");
    
    // Simple test query
    const [result] = await db.query("SELECT 1 as test");
    console.log("DB test result:", result);
    
    // Test notifications table
    const [count] = await db.query("SELECT COUNT(*) as count FROM notifications WHERE user_id = 8");
    console.log("Notifications count:", count);
    
    return NextResponse.json({
      success: true,
      message: "Database connection working",
      test: result,
      notificationsCount: count,
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Database error", 
        details: (error as any).message 
      },
      { status: 500 }
    );
  }
} 