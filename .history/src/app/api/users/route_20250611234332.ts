import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { passwordUtils } from "@/lib/password";

export async function GET(request: NextRequest) {
  try {
    console.log("DEBUG: Starting GET /api/users");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    console.log("DEBUG: Query params:", { page, limit, search, role });

    const offset = (page - 1) * limit;

    // Build query conditions
    let whereConditions = [];
    let params = [];

    if (search) {
      whereConditions.push(
        "(full_name LIKE ? OR email LIKE ? OR phone_number LIKE ?)"
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (role) {
      whereConditions.push("role = ?");
      params.push(role.toUpperCase());
    }

    const whereClause =
      whereConditions.length > 0
        ? "WHERE " + whereConditions.join(" AND ")
        : "";
    console.log("DEBUG: Where clause:", whereClause);
    console.log("DEBUG: Params:", params);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    console.log("DEBUG: Count query:", countQuery);

    const countResult = await db.queryFirst(countQuery, params);
    const total = countResult?.total || 0;
    console.log("DEBUG: Total users:", total);

    // Get users with pagination - chỉ từ users table, không có orders
    const query = `
      SELECT 
        user_id,
        full_name,
        email,
        phone_number,
        address,
        role,
        created_at
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    console.log("DEBUG: Main query:", query);
    console.log("DEBUG: Query params:", [...params, limit, offset]);

    const users = await db.query(query, [...params, limit, offset]);
    console.log("DEBUG: Raw users from database:", users);

    // Transform data to match frontend interface
    const transformedUsers = users.map((user: any) => ({
      id: user.user_id,
      name: user.full_name,
      email: user.email,
      phone: user.phone_number || "",
      address: user.address || "",
      role: user.role ? user.role.toLowerCase() : "customer",
      status: "active", // Always active since no is_active column
      totalOrders: user.total_orders || 0,
      totalSpent: user.total_spent || 0,
      lastLogin: user.created_at, // Use created_at as lastLogin since no last_login column
      createdAt: user.created_at,
    }));

    console.log("DEBUG: Transformed users:", transformedUsers);

    const response = {
      success: true,
      data: transformedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    console.log("DEBUG: Final response:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get users error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { success: false, message: "Lỗi server nội bộ", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("DEBUG: Starting POST /api/users");

    const body = await request.json();
    const { name, email, password, phone, address, role = "customer" } = body;

    console.log("DEBUG: Request body:", { name, email, phone, address, role });

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Tên, email và mật khẩu không được để trống",
        },
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
    const existingUser = await db.queryFirst(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email đã được sử dụng" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await passwordUtils.hashPassword(password);
    console.log("DEBUG: Password hashed successfully");

    // Insert new user - only use existing columns
    const insertParams = [
      name,
      email,
      hashedPassword,
      phone || null,
      address || null,
      role.toUpperCase(),
    ];
    console.log("DEBUG: Insert params:", insertParams);

    const userId = await db.insert(
      `
      INSERT INTO users (full_name, email, password_hash, phone_number, address, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `,
      insertParams
    );

    console.log("DEBUG: User created with ID:", userId);

    // Get the created user
    const newUser = await db.queryFirst(
      `
      SELECT 
        user_id,
        full_name,
        email,
        phone_number,
        address,
        role,
        created_at
      FROM users 
      WHERE user_id = ?
    `,
      [userId]
    );

    console.log("DEBUG: Retrieved new user:", newUser);

    const transformedUser = {
      id: newUser.user_id,
      name: newUser.full_name,
      email: newUser.email,
      phone: newUser.phone_number || "",
      address: newUser.address || "",
      role: newUser.role ? newUser.role.toLowerCase() : "customer",
      status: "active", // Always active since no is_active column
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
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { success: false, message: "Lỗi server nội bộ", error: error.message },
      { status: 500 }
    );
  }
}
