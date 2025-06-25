import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";
import { passwordUtils } from "@/lib/password";
import { SignupForm, ResponseMessage } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: SignupForm = await request.json();
    const {
      fullName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      address,
      role,
    } = body;

    console.log("DEBUG: Signup attempt for email:", email);

    // Validate required fields
    if (!fullName || fullName.trim().length === 0) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Tên hiển thị không được để trống",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!email || email.trim().length === 0) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Email không được để trống",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Email không hợp lệ",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!password || password.trim().length === 0) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Mật khẩu không được để trống",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate password strength (same as Spring Boot)
    const passwordValidation = passwordUtils.validatePassword(password);
    if (!passwordValidation.isValid) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: passwordValidation.errors[0], // Show first error
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check password confirmation
    if (confirmPassword && password !== confirmPassword) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Mật khẩu xác nhận không khớp",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate phone number if provided (same pattern as Spring Boot)
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

    // Check if user already exists
    const existingUser = await dbHelpers.findUserByEmail(email);
    if (existingUser) {
      console.log("DEBUG: User already exists with email:", email);
      const errorResponse: ResponseMessage = {
        status: 409,
        message: "Email đã được sử dụng",
      };
      return NextResponse.json(errorResponse, { status: 409 });
    }

    // Hash password
    const hashedPassword = await passwordUtils.hashPassword(password);

    // Create user data
    const userData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashedPassword,
      phoneNumber: phoneNumber?.trim() || undefined,
      address: address?.trim() || undefined,
      role: role || "USER",
    };

    // Insert user into database
    console.log("DEBUG: About to create user with data:", JSON.stringify(userData, null, 2));
    
    try {
      const userId = await dbHelpers.createUser(userData);
      console.log("DEBUG: User created successfully with ID:", userId);
    } catch (createUserError) {
      console.error("DEBUG: Error creating user:", createUserError);
      throw createUserError; // Re-throw để catch block bên ngoài xử lý
    }

    // Return success response (matching Spring Boot)
    const successResponse: ResponseMessage = {
      status: 201,
      message: "Đăng ký tài khoản thành công",
      data: {
        userId,
        email: userData.email,
        fullName: userData.fullName,
      },
    };

    return NextResponse.json(successResponse, {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Check for duplicate key error (MySQL error code 1062)
    if ((error as any).code === "ER_DUP_ENTRY") {
      const errorResponse: ResponseMessage = {
        status: 409,
        message: "Email đã được sử dụng",
      };
      return NextResponse.json(errorResponse, { status: 409 });
    }

    const errorResponse: ResponseMessage = {
      status: 500,
      message: "Lỗi server nội bộ",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
