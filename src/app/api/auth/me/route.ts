import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";
import { tokenUtils } from "@/lib/jwt";
import { User, ResponseMessage } from "@/types/auth";

export async function GET(request: NextRequest) {
  try {
    // Extract and verify token
    const { username } = await tokenUtils.extractUserFromRequest(request);

    console.log("DEBUG: Profile request for user:", username);

    // Find user in database
    const user = await dbHelpers.findUserByUsername(username);

    if (!user) {
      console.log("DEBUG: User not found in database:", username);
      const errorResponse: ResponseMessage = {
        status: 404,
        message: "Người dùng không tồn tại",
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Prepare user response (exclude sensitive data)
    const userProfile: User = {
      id: user.user_id,
      name: user.full_name,
      username: user.email,
      email: user.email,
      phoneNumber: user.phone_number,
      address: user.address,
      role: user.role,
      enabled: true,
      createdAt: user.created_at,
      avatarCode: user.avatar_code,
    };

    console.log("DEBUG: Profile retrieved successfully for user:", username);

    return NextResponse.json(userProfile, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Profile error:", error);

    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes("token")) {
      const errorResponse: ResponseMessage = {
        status: 401,
        message: "Token không hợp lệ hoặc đã hết hạn",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const errorResponse: ResponseMessage = {
      status: 500,
      message: "Lỗi server nội bộ",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Extract and verify token
    const { username } = await tokenUtils.extractUserFromRequest(request);

    // Parse request body
    const updateData = await request.json();
    const { fullName, phoneNumber, address } = updateData;

    console.log("DEBUG: Profile update request for user:", username);

    // Find user in database
    const user = await dbHelpers.findUserByUsername(username);

    if (!user) {
      const errorResponse: ResponseMessage = {
        status: 404,
        message: "Người dùng không tồn tại",
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Validate phone number if provided
    if (phoneNumber && phoneNumber.trim().length > 0) {
      const phoneRegex = /(\d{4}[-.]?\d{3}[-.]?\d{3})/;
      if (!phoneRegex.test(phoneNumber)) {
        const errorResponse: ResponseMessage = {
          status: 400,
          message:
            "Số điện thoại phải bao gồm 10 chữ số và có thể có dấu chấm hoặc dấu gạch ngang giữa các phần tử",
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }
    }

    // Prepare update data
    const userData: any = {};
    if (fullName !== undefined) userData.fullName = fullName;
    if (phoneNumber !== undefined) userData.phoneNumber = phoneNumber;
    if (address !== undefined) userData.address = address;

    // Update user in database
    const affectedRows = await dbHelpers.updateUser(user.user_id, userData);

    if (affectedRows === 0) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Không có dữ liệu nào được cập nhật",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    console.log("DEBUG: Profile updated successfully for user:", username);

    // Return success response
    const successResponse: ResponseMessage = {
      status: 200,
      message: "Cập nhật thông tin thành công",
      data: {
        updatedFields: Object.keys(userData),
      },
    };

    return NextResponse.json(successResponse, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);

    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes("token")) {
      const errorResponse: ResponseMessage = {
        status: 401,
        message: "Token không hợp lệ hoặc đã hết hạn",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const errorResponse: ResponseMessage = {
      status: 500,
      message: "Lỗi server nội bộ",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
