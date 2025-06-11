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
    
    const user = await db.queryFirst(`
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
      WHERE user_id = ?
    `, [userId]);
    
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
      role: user.role.toLowerCase(),
      status: user.is_active ? "active" : "inactive",
      totalOrders: user.total_orders || 0,
      totalSpent: user.total_spent || 0,
      lastLogin: user.last_login || user.created_at,
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
    const { name, email, phone, address, role, status, password } = body;
    
    // Check if user exists
    const existingUser = await db.queryFirst("SELECT user_id, email FROM users WHERE user_id = ?", [userId]);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }
    
    // Check if email is already used by another user
    if (email && email !== existingUser.email) {
      const emailExists = await db.queryFirst("SELECT user_id FROM users WHERE email = ? AND user_id != ?", [email, userId]);
      if (emailExists) {
        return NextResponse.json(
          { success: false, message: "Email đã được sử dụng bởi người dùng khác" },
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
    
    if (status !== undefined) {
      updateFields.push("is_active = ?");
      updateValues.push(status === "active" ? 1 : 0);
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
    
    await db.update(`
      UPDATE users 
      SET ${updateFields.join(", ")}, updated_at = NOW()
      WHERE user_id = ?
    `, updateValues);
    
    // Get updated user
    const updatedUser = await db.queryFirst(`
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
      WHERE user_id = ?
    `, [userId]);
    
    const transformedUser = {
      id: updatedUser.user_id,
      name: updatedUser.full_name,
      email: updatedUser.email,
      phone: updatedUser.phone_number || "",
      address: updatedUser.address || "",
      role: updatedUser.role.toLowerCase(),
      status: updatedUser.is_active ? "active" : "inactive",
      totalOrders: updatedUser.total_orders || 0,
      totalSpent: updatedUser.total_spent || 0,
      lastLogin: updatedUser.last_login || updatedUser.created_at,
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
      { success: false, message: "Lỗi server nội bộ" },
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
    const existingUser = await db.queryFirst("SELECT user_id FROM users WHERE user_id = ?", [userId]);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }
    
    // Check if user has orders (optional: you might want to soft delete instead)
    const hasOrders = await db.queryFirst("SELECT COUNT(*) as count FROM orders WHERE user_id = ?", [userId]);
    if (hasOrders && hasOrders.count > 0) {
      // Soft delete: deactivate instead of hard delete
      await db.update("UPDATE users SET is_active = 0, updated_at = NOW() WHERE user_id = ?", [userId]);
      return NextResponse.json({
        success: true,
        message: "Người dùng đã được vô hiệu hóa (do có đơn hàng liên quan)",
      });
    }
    
    // Hard delete if no orders
    await db.delete("DELETE FROM users WHERE user_id = ?", [userId]);
    
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