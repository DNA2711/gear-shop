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

    // Check if orders table exists
    let hasOrdersTable = false;
    try {
      await db.queryFirst("SELECT 1 FROM orders LIMIT 1");
      hasOrdersTable = true;
    } catch (error) {
      hasOrdersTable = false;
    }

    let query;
    if (hasOrdersTable) {
      query = `
        SELECT 
          user_id,
          full_name,
          email,
          phone_number,
          address,
          role,
          created_at,
          (SELECT COUNT(*) FROM orders WHERE user_id = users.user_id) as total_orders,
          (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = users.user_id AND status = 'completed') as total_spent
        FROM users 
        WHERE user_id = ?
      `;
    } else {
      query = `
        SELECT 
          user_id,
          full_name,
          email,
          phone_number,
          address,
          role,
          created_at,
          0 as total_orders,
          0 as total_spent
        FROM users 
        WHERE user_id = ?
      `;
    }

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
      status: "active", // Always active since no is_active column
      totalOrders: user.total_orders || 0,
      totalSpent: user.total_spent || 0,
      lastLogin: user.created_at, // Use created_at as lastLogin since no last_login column
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
    console.log("DEBUG: Starting PUT /api/users/[id]");
    
    const userId = parseInt(params.id);
    console.log("DEBUG: User ID:", userId);

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "ID người dùng không hợp lệ" },
        { status: 400 }
      );
    }

    const body = await request.json();
    // Bỏ status từ destructuring vì không dùng
    const { name, email, phone, address, role, password } = body;
    console.log("DEBUG: Request body:", { name, email, phone, address, role, hasPassword: !!password });

    // Check if user exists
    const existingUser = await db.queryFirst(
      "SELECT user_id, email FROM users WHERE user_id = ?",
      [userId]
    );
    console.log("DEBUG: Existing user:", existingUser);
    
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

    // Build update fields - only use existing columns
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

    console.log("DEBUG: Update fields:", updateFields);
    console.log("DEBUG: Update values:", updateValues);

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: "Không có dữ liệu để cập nhật" },
        { status: 400 }
      );
    }

    updateValues.push(userId);
    console.log("DEBUG: Final update values:", updateValues);

    // Update query
    const updateQuery = `UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`;
    console.log("DEBUG: Update query:", updateQuery);

    await db.update(updateQuery, updateValues);
    console.log("DEBUG: User updated successfully");

    // Get updated user - Check if orders table exists
    let hasOrdersTableForUpdate = false;
    try {
      await db.queryFirst("SELECT 1 FROM orders LIMIT 1");
      hasOrdersTableForUpdate = true;
      console.log("DEBUG: Orders table exists for update");
    } catch (error) {
      hasOrdersTableForUpdate = false;
      console.log("DEBUG: Orders table doesn't exist for update:", error.message);
    }

    let updateQuery2;
    if (hasOrdersTableForUpdate) {
      updateQuery2 = `
        SELECT 
          user_id,
          full_name,
          email,
          phone_number,
          address,
          role,
          created_at,
          (SELECT COUNT(*) FROM orders WHERE user_id = users.user_id) as total_orders,
          (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = users.user_id AND status = 'completed') as total_spent
        FROM users 
        WHERE user_id = ?
      `;
    } else {
      updateQuery2 = `
        SELECT 
          user_id,
          full_name,
          email,
          phone_number,
          address,
          role,
          created_at,
          0 as total_orders,
          0 as total_spent
        FROM users 
        WHERE user_id = ?
      `;
    }

    console.log("DEBUG: Select query after update:", updateQuery2);
    const updatedUser = await db.queryFirst(updateQuery2, [userId]);
    console.log("DEBUG: Retrieved updated user:", updatedUser);

    const transformedUser = {
      id: updatedUser.user_id,
      name: updatedUser.full_name,
      email: updatedUser.email,
      phone: updatedUser.phone_number || "",
      address: updatedUser.address || "",
      role: updatedUser.role ? updatedUser.role.toLowerCase() : "customer",
      status: "active", // Always active since no is_active column
      totalOrders: updatedUser.total_orders || 0,
      totalSpent: updatedUser.total_spent || 0,
      lastLogin: updatedUser.created_at, // Use created_at as lastLogin since no last_login column
      createdAt: updatedUser.created_at,
    };

    console.log("DEBUG: Transformed user:", transformedUser);

    return NextResponse.json({
      success: true,
      data: transformedUser,
      message: "Cập nhật người dùng thành công",
    });
  } catch (error) {
    console.error("Update user error:", error);
    console.error("Error stack:", error.stack);
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

    // Check if user has orders (optional: you might want to soft delete instead)
    let hasOrders = false;
    try {
      const orderCheck = await db.queryFirst(
        "SELECT COUNT(*) as count FROM orders WHERE user_id = ?",
        [userId]
      );
      hasOrders = orderCheck && orderCheck.count > 0;
    } catch (error) {
      // Orders table might not exist, proceed with hard delete
      hasOrders = false;
    }

    if (hasOrders) {
      return NextResponse.json(
        {
          success: false,
          message: "Không thể xóa người dùng này vì có đơn hàng liên quan",
        },
        { status: 400 }
      );
    }

    // Hard delete since no soft delete option without is_active
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
