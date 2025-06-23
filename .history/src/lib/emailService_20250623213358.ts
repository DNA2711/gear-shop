import nodemailer from "nodemailer";

// Email configuration từ environment variables
const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
};

// Tạo transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Interface cho email options
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Hàm gửi email chung
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Verify transporter config
    await transporter.verify();

    const mailOptions = {
      from: `"Gear Shop" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};

// Template cho reset password email
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetUrl: string
): Promise<boolean> => {
  const subject = "Reset mật khẩu - Gear Shop";

  const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset mật khẩu</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .title {
          color: #1f2937;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #6b7280;
          font-size: 16px;
          margin-bottom: 30px;
        }
        .content {
          margin-bottom: 30px;
        }
        .greeting {
          font-size: 18px;
          color: #374151;
          margin-bottom: 20px;
        }
        .message {
          color: #4b5563;
          margin-bottom: 30px;
          line-height: 1.7;
        }
        .reset-button {
          display: inline-block;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        }
        .reset-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }
        .warning {
          background: #fef3cd;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 16px;
          margin: 25px 0;
          color: #92400e;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .security-info {
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 8px;
          padding: 16px;
          margin: 25px 0;
          color: #0c4a6e;
        }
        .link-text {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 12px;
          font-family: monospace;
          font-size: 14px;
          word-break: break-all;
          margin: 15px 0;
          color: #374151;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🛒 Gear Shop</div>
          <h1 class="title">Reset Mật Khẩu</h1>
          <p class="subtitle">Yêu cầu thay đổi mật khẩu cho tài khoản của bạn</p>
        </div>

        <div class="content">
          <p class="greeting">Xin chào <strong>${name}</strong>,</p>
          
          <p class="message">
            Chúng tôi nhận được yêu cầu reset mật khẩu cho tài khoản Gear Shop của bạn. 
            Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="reset-button">
              🔑 Đặt Lại Mật Khẩu
            </a>
          </div>

          <div class="warning">
            <strong>⚠️ Lưu ý quan trọng:</strong><br>
            • Link này chỉ có hiệu lực trong <strong>15 phút</strong><br>
            • Chỉ sử dụng được một lần duy nhất<br>
            • Không chia sẻ link này với bất kỳ ai
          </div>

          <p class="message">
            Nếu nút bên trên không hoạt động, bạn có thể copy và paste đường link sau vào trình duyệt:
          </p>

          <div class="link-text">
            ${resetUrl}
          </div>

          <div class="security-info">
            <strong>🔒 Bảo mật:</strong> Gear Shop sẽ không bao giờ yêu cầu mật khẩu qua email. 
            Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ support của chúng tôi.
          </div>
        </div>

        <div class="footer">
          <p>
            <strong>Gear Shop</strong><br>
            Email: support@gearshop.com | Hotline: 1900-xxxx<br>
            Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
          </p>
          <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
            Bạn nhận được email này vì có yêu cầu reset mật khẩu cho tài khoản ${email}.<br>
            Nếu không phải bạn thực hiện, vui lòng bỏ qua email này.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Xin chào ${name},

Chúng tôi nhận được yêu cầu reset mật khẩu cho tài khoản Gear Shop của bạn.

Để reset mật khẩu, vui lòng truy cập đường link sau:
${resetUrl}

LƯU Ý QUAN TRỌNG:
- Link này chỉ có hiệu lực trong 15 phút
- Chỉ sử dụng được một lần duy nhất
- Không chia sẻ link này với bất kỳ ai

Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.

Trân trọng,
Gear Shop Team
  `;

  return await sendEmail({
    to: email,
    subject,
    html,
    text,
  });
};

// Template cho email chào mừng (có thể dùng sau)
export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<boolean> => {
  const subject = "Chào mừng đến với Gear Shop!";

  const html = `
    <h2>Xin chào ${name}!</h2>
    <p>Chào mừng bạn đến với Gear Shop - Cửa hàng công nghệ hàng đầu!</p>
    <p>Tài khoản của bạn đã được tạo thành công với email: <strong>${email}</strong></p>
    <p>Bạn có thể bắt đầu mua sắm ngay bây giờ!</p>
    <br>
    <p>Trân trọng,<br>Gear Shop Team</p>
  `;

  return await sendEmail({
    to: email,
    subject,
    html,
  });
};

// Test email connection
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log("✅ Email service is ready");
    return true;
  } catch (error) {
    console.error("❌ Email service error:", error);
    return false;
  }
};
