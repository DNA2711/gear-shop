import { NextResponse } from "next/server";
import { jwtService } from "@/lib/jwt";
import { db } from "@/lib/database";

export async function GET(req: Request) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization");
    console.log("Debug Token API - Auth header:", authHeader ? "present" : "missing");
    
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;
    
    console.log("Debug Token API - Token extracted:", token ? "yes" : "no");
    
    if (!token) {
      return NextResponse.json({ 
        error: "No token provided",
        authHeader: authHeader || "missing",
        token: "missing"
      }, { status: 401 });
    }

    // Try to verify token
    try {
      const payload = await jwtService.verifyToken(token);
      console.log("Debug Token API - Token verified successfully");
      
      // Get user from database
      const user = await db.queryFirst(
        "SELECT user_id, email, role, full_name FROM users WHERE email = ?",
        [payload.username]
      );
      
      return NextResponse.json({
        message: "Token is valid",
        payload: {
          username: payload.username,
          roles: payload.roles,
          exp: payload.exp,
          iat: payload.iat
        },
        user: user ? {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          full_name: user.full_name
        } : null,
        tokenLength: token.length,
        tokenStart: token.substring(0, 20) + "..."
      });
      
    } catch (tokenError) {
      console.log("Debug Token API - Token verification failed:", tokenError);
      return NextResponse.json({
        error: "Token verification failed",
        details: tokenError instanceof Error ? tokenError.message : String(tokenError),
        tokenLength: token.length,
        tokenStart: token.substring(0, 20) + "..."
      }, { status: 401 });
    }
    
  } catch (error) {
    console.error("Debug Token API - General error:", error);
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 