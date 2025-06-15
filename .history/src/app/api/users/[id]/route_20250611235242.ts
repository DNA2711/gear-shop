import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { passwordUtils } from "@/lib/password";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "ID người dùng không hợp lệ" },
        { status: 400 }
      );
    }

    // Query chỉ từ users table, không có orders
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
      WHERE user_id = ?
    `;

    const user = await db.queryFirst(query, [userId]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    const transformedUser = {
      id: user.user_id,
      name: user.full_name,
      email: user.email,
      phone: user.phone_number || "",
      address: user.address || "",
      role: user.role ? user.role.toLowerCase() : "customer",
      status: "active",
      totalOrders: 0,
      totalSpent: 0,
      lastLogin: user.created_at,
      createdAt: user.created_at,
    };

    return NextResponse.json({
      success: true,
      data: transformedUser,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server nội bộ" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "ID người dùng không hợp lệ" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, phone, address, role, password } = body;

    // Check if user exists
    const existingUser = await db.queryFirst(
      "SELECT user_id, email FROM users WHERE user_id = ?",
      [userId]
    );

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Check if email is already used by another user
    if (email && email !== existingUser.email) {
      const emailExists = await db.queryFirst(
        "SELECT user_id FROM users WHERE email = ? AND user_id != ?",
        [email, userId]
      );
      if (emailExists) {
        return NextResponse.json(
          {
            success: false,
            message: "Email đã được sử dụng bởi người dùng khác",
          },
          { status: 409 }
        );
      }
    }

    // Build update fields
    let updateFields = [];
    let updateValues = [];

    if (name !== undefined) {
      updateFields.push("full_name = ?");
      updateValues.push(name);
    }

    if (email !== undefined) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }

    if (phone !== undefined) {
      updateFields.push("phone_number = ?");
      updateValues.push(phone || null);
    }

    if (address !== undefined) {
      updateFields.push("address = ?");
      updateValues.push(address || null);
    }

    if (role !== undefined) {
      updateFields.push("role = ?");
      updateValues.push(role.toUpperCase());
    }

    if (password) {
      const hashedPassword = await passwordUtils.hashPassword(password);
      updateFields.push("password_hash = ?");
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: "Không có dữ liệu để cập nhật" },
        { status: 400 }
      );
    }

    updateValues.push(userId);

    // Update query
    const updateQuery = `UPDATE users SET ${updateFields.join(
      ", "
    )} WHERE user_id = ?`;
    await db.update(updateQuery, updateValues);

    // Get updated user
    const selectQuery = `
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
    `;

    const updatedUser = await db.queryFirst(selectQuery, [userId]);

    const transformedUser = {
      id: updatedUser.user_id,
      name: updatedUser.full_name,
      email: updatedUser.email,
      phone: updatedUser.phone_number || "",
      address: updatedUser.address || "",
      role: updatedUser.role ? updatedUser.role.toLowerCase() : "customer",
      status: "active",
      totalOrders: 0,
      totalSpent: 0,
      lastLogin: updatedUser.created_at,
      createdAt: updatedUser.created_at,
    };

    return NextResponse.json({
      success: true,
      data: transformedUser,
      message: "Cập nhật người dùng thành công",
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server nội bộ", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "ID người dùng không hợp lệ" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.queryFirst(
      "SELECT user_id FROM users WHERE user_id = ?",
      [userId]
    );
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Delete user
    await db.update("DELETE FROM users WHERE user_id = ?", [userId]);

    return NextResponse.json({
      success: true,
      message: "Xóa người dùng thành công",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server nội bộ" },
      { status: 500 }
    );
  }
}
