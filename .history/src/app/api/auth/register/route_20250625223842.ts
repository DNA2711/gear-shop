import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";
import { passwordUtils } from "@/lib/password";
import { SignupForm, ResponseMessage } from "@/types/auth";
import {
  ErrorMessages,
  handleDatabaseError,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/errorMessages";

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

    if (process.env.NODE_ENV === "development") {
      console.log("DEBUG: Signup attempt for email:", email);
    }

    // Validate required fields
    if (!fullName || fullName.trim().length === 0) {
      return NextResponse.json(
        createErrorResponse(400, "Tên hiển thị không được để trống"),
        { status: 400 }
      );
    }

    if (!email || email.trim().length === 0) {
      return NextResponse.json(
        createErrorResponse(400, ErrorMessages.AUTH.EMAIL_REQUIRED),
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        createErrorResponse(400, ErrorMessages.VALIDATION.INVALID_EMAIL),
        { status: 400 }
      );
    }

    if (!password || password.trim().length === 0) {
      return NextResponse.json(
        createErrorResponse(400, ErrorMessages.AUTH.PASSWORD_REQUIRED),
        { status: 400 }
      );
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
      return NextResponse.json(
        createErrorResponse(400, ErrorMessages.VALIDATION.PASSWORD_MISMATCH),
        { status: 400 }
      );
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
      if (process.env.NODE_ENV === "development") {
        console.log("DEBUG: User already exists with email:", email);
      }
      return NextResponse.json(
        createErrorResponse(409, ErrorMessages.AUTH.EMAIL_EXISTS),
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await passwordUtils.hashPassword(password);

    // Create user data
    const userData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashedPassword,
      phoneNumber: phoneNumber?.trim() || null,
      address: address?.trim() || null,
      role: role || "USER",
    };

    // Insert user into database
    if (process.env.NODE_ENV === "development") {
      console.log(
        "DEBUG: About to create user with data:",
        JSON.stringify(userData, null, 2)
      );
    }

    let userId: number;
    try {
      userId = await dbHelpers.createUser(userData);
      if (process.env.NODE_ENV === "development") {
        console.log("DEBUG: User created successfully with ID:", userId);
      }
    } catch (createUserError) {
      if (process.env.NODE_ENV === "development") {
        console.error("DEBUG: Error creating user:", createUserError);
      }
      throw createUserError; // Re-throw để catch block bên ngoài xử lý
    }

    // Return success response
    return NextResponse.json(
      createSuccessResponse(ErrorMessages.AUTH.REGISTRATION_SUCCESS, {
        userId,
        email: userData.email,
        fullName: userData.fullName,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // Log detailed error for debugging (development only)
    if (process.env.NODE_ENV === "development") {
      console.error("Signup error:", error);
      console.error("Error details:", {
        message: (error as any).message,
        code: (error as any).code,
        errno: (error as any).errno,
        sqlState: (error as any).sqlState,
        sqlMessage: (error as any).sqlMessage,
        stack: (error as any).stack,
      });
    } else {
      // Production: Log basic error without sensitive details
      console.error("Signup error:", (error as any).message);
    }

    // Use handleDatabaseError helper for consistent error handling
    const { status, message } = handleDatabaseError(error);
    return NextResponse.json(createErrorResponse(status, message), { status });
  }
}
