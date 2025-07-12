import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    console.log("Testing notifications table...");
    
    // Test 1: Check if table exists
    const tableCheck = await db.query("SHOW TABLES LIKE 'notifications'");
    console.log("Table check result:", tableCheck);
    
    if (tableCheck.length === 0) {
      return NextResponse.json({ 
        error: "Notifications table does not exist",
        suggestions: "Please run database migrations"
      }, { status: 500 });
    }
    
    // Test 2: Check table structure
    const structureCheck = await db.query("DESCRIBE notifications");
    console.log("Table structure:", structureCheck);
    
    // Test 3: Simple count query
    const countResult = await db.query("SELECT COUNT(*) as total FROM notifications");
    console.log("Total notifications:", countResult);
    
    // Test 4: Simple select with limit (no parameters)
    const simpleSelect = await db.query("SELECT notification_id, user_id, title FROM notifications LIMIT 3");
    console.log("Sample notifications:", simpleSelect);
    
    // Test 5: Select with parameter
    const parameterTest = await db.query("SELECT COUNT(*) as count FROM notifications WHERE user_id = ?", [1]);
    console.log("Parameter test result:", parameterTest);
    
    return NextResponse.json({
      success: true,
      tests: {
        tableExists: tableCheck.length > 0,
        structure: structureCheck,
        totalCount: countResult[0]?.total || 0,
        sampleData: simpleSelect,
        parameterTest: parameterTest[0]?.count || 0
      }
    });
    
  } catch (error) {
    console.error("Test failed:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 