import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { passwordUtils } from "@/lib/password";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";
    
    const offset = (page - 1) * limit;
    
    // Build query conditions
    let whereConditions = [];
    let params = [];
    
    if (search) {
      whereConditions.push("(full_name LIKE ? OR email LIKE ? OR phone_number LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (role) {
      whereConditions.push("role = ?");
      params.push(role);
    }
    
    if (status === "active") {
      whereConditions.push("is_active = 1");
    } else if (status === "inactive") {
      whereConditions.push("is_active = 0");
    }
    
    const whereClause = whereConditions.length > 0 ? "WHERE " + whereConditions.join(" AND ") : "";
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const countResult = await db.queryFirst(countQuery, params);
    const total = countResult?.total || 0;
    
    // Get users with pagination
    const query = `
      SELECT 
        user_id,
        full_name,
        email,
        phone_number,
        address,
        role,
        is_active,
        created_at,
        last_login,
        (SELECT COUNT(*) FROM orders WHERE user_id = users.user_id) as total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = users.user_id AND status = 'completed') as total_spent
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const users = await db.query(query, [...params, limit, offset]);
    
    // Transform data to match frontend interface
    const transformedUsers = users.map((user: any) => ({
      id: user.user_id,
      name: user.full_name,
      email: user.email,
      phone: user.phone_number || "",
      address: user.address || "",
      role: user.role.toLowerCase(),
      status: user.is_active ? "active" : "inactive",
      totalOrders: user.total_orders || 0,
      totalSpent: user.total_spent || 0,
      lastLogin: user.last_login || user.created_at,
      createdAt: user.created_at,
    }));
    
    return NextResponse.json({
      success: true,
      data: transformedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server nội bộ" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, address, role = "customer" } = body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Tên, email và mật khẩu không được để trống" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Email không hợp lệ" },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await db.queryFirst("SELECT user_id FROM users WHERE email = ?", [email]);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email đã được sử dụng" },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await passwordUtils.hashPassword(password);
    
    // Insert new user
    const userId = await db.insert(`
      INSERT INTO users (full_name, email, password_hash, phone_number, address, role, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, NOW())
    `, [name, email, hashedPassword, phone || null, address || null, role.toUpperCase()]);
    
    // Get the created user
    const newUser = await db.queryFirst(`
      SELECT 
        user_id,
        full_name,
        email,
        phone_number,
        address,
        role,
        is_active,
        created_at
      FROM users 
      WHERE user_id = ?
    `, [userId]);
    
    const transformedUser = {
      id: newUser.user_id,
      name: newUser.full_name,
      email: newUser.email,
      phone: newUser.phone_number || "",
      address: newUser.address || "",
      role: newUser.role.toLowerCase(),
      status: newUser.is_active ? "active" : "inactive",
      totalOrders: 0,
      totalSpent: 0,
      lastLogin: newUser.created_at,
      createdAt: newUser.created_at,
    };
    
    return NextResponse.json({
      success: true,
      data: transformedUser,
      message: "Tạo người dùng thành công",
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server nội bộ" },
      { status: 500 }
    );
  }
} 