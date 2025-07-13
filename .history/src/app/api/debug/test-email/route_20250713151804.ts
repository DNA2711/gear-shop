import { NextRequest, NextResponse } from "next/server";
import { sendEmail, testEmailConnection } from "@/lib/emailService";

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  try {
    // Test SMTP connection
    const connectionTest = await testEmailConnection();
    
    if (!connectionTest) {
      return NextResponse.json({
        success: false,
        error: "SMTP connection failed",
        message: "Kiểm tra lại cấu hình SMTP trong .env.local",
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          hasPassword: !!process.env.SMTP_PASS,
        }
      }, { status: 500 });
    }

    // Send test email
    const testEmail = await sendEmail({
      to: process.env.SMTP_USER || "test@example.com",
      subject: "🧪 Test Email - Gear Shop",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">✅ Email Test Successful!</h2>
          <p>Chúc mừng! SMTP đã được cấu hình thành công.</p>
          <p><strong>Thời gian:</strong> ${new Date().toLocaleString("vi-VN")}</p>
          <p><strong>Server:</strong> ${process.env.SMTP_HOST}</p>
          <p><strong>Port:</strong> ${process.env.SMTP_PORT}</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">Cấu hình SMTP:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Host: ${process.env.SMTP_HOST}</li>
              <li>Port: ${process.env.SMTP_PORT}</li>
              <li>User: ${process.env.SMTP_USER}</li>
              <li>Password: ${process.env.SMTP_PASS ? '✅ Configured' : '❌ Missing'}</li>
            </ul>
          </div>
          
          <p style="color: #16a34a; font-weight: bold;">
            🎉 Hệ thống email đã sẵn sàng hoạt động!
          </p>
        </div>
      `,
      text: "Email test successful! SMTP configuration is working properly."
    });

    return NextResponse.json({
      success: true,
      message: "Email test sent successfully!",
      details: {
        connectionTest: "✅ PASSED",
        emailSent: testEmail ? "✅ SENT" : "❌ FAILED",
        recipient: process.env.SMTP_USER,
        timestamp: new Date().toISOString(),
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          secure: process.env.SMTP_PORT === "465",
        }
      }
    });

  } catch (error) {
    console.error("Test email error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Test email failed",
      message: error instanceof Error ? error.message : "Unknown error",
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        hasPassword: !!process.env.SMTP_PASS,
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    const testEmail = await sendEmail({
      to: email,
      subject: "🧪 Custom Test Email - Gear Shop",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">📧 Custom Test Email</h2>
          <p>Email này được gửi đến <strong>${email}</strong> để test SMTP configuration.</p>
          <p><strong>Thời gian:</strong> ${new Date().toLocaleString("vi-VN")}</p>
          <p style="color: #16a34a; font-weight: bold;">
            ✅ SMTP hoạt động bình thường!
          </p>
        </div>
      `,
      text: `Test email sent to ${email} at ${new Date().toISOString()}`
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email}`,
      emailSent: testEmail
    });

  } catch (error) {
    console.error("Custom test email error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to send custom test email",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 