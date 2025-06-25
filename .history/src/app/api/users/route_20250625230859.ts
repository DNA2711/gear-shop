import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { passwordUtils } from "@/lib/password";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
    const limit = Math.max(
      1,
      Math.min(100, parseInt(searchParams.get("limit") || "10") || 10)
    );
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const offset = Math.max(0, (page - 1) * limit);

    // Safety check
    if (
      !Number.isInteger(limit) ||
      !Number.isInteger(offset) ||
      limit <= 0 ||
      offset < 0
    ) {
      throw new Error(
        `Invalid pagination params: limit=${limit}, offset=${offset}`
      );
    }

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

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const countResult = await db.queryFirst(countQuery, params);
    const total = countResult?.total || 0;

    // Get users with pagination - chỉ từ users table, không có orders
    let query = `
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
      LIMIT ${limit} OFFSET ${offset}
    `;

    const users = await db.query(query, params);

    // Transform data to match frontend interface
    const transformedUsers = users.map((user: any) => ({
      id: user.user_id,
      name: user.full_name,
      email: user.email,
      phone: user.phone_number || "",
      address: user.address || "",
      role: user.role
        ? user.role.toLowerCase() === "user"
          ? "customer"
          : user.role.toLowerCase()
        : "customer",
      status: "active",
      totalOrders: 0,
      totalSpent: 0,
      lastLogin: user.created_at,
      createdAt: user.created_at,
    }));

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

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi server nội bộ",
        error: error instanceof Error ? error.message : String(error),
      },
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

    // Insert new user
    const insertParams = [
      name,
      email,
      hashedPassword,
      phone || null,
      address || null,
      role.toUpperCase(),
    ];
    const userId = await db.insert(
      `
      INSERT INTO users (full_name, email, password_hash, phone_number, address, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `,
      insertParams
    );

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

    const transformedUser = {
      id: newUser.user_id,
      name: newUser.full_name,
      email: newUser.email,
      phone: newUser.phone_number || "",
      address: newUser.address || "",
      role: newUser.role ? newUser.role.toLowerCase() : "customer",
      status: "active",
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
      {
        success: false,
        message: "Lỗi server nội bộ",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
