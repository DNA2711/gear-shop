# Cấu hình Email cho Gear Shop

## Tổng quan

Gear Shop sử dụng Nodemailer để gửi email reset mật khẩu. Bạn có thể sử dụng nhiều nhà cung cấp email khác nhau.

## 1. Cấu hình Gmail (Khuyến nghị)

### Bước 1: Tạo App Password cho Gmail

1. Đăng nhập vào Gmail của bạn
2. Đi đến **Google Account Settings** → **Security**
3. Bật **2-Step Verification** (nếu chưa có)
4. Trong **2-Step Verification**, tìm **App passwords**
5. Chọn **Mail** và **Other (Custom name)**
6. Nhập tên: "Gear Shop"
7. Copy **App Password** được tạo (16 ký tự)

### Bước 2: Cập nhật file .env

```env
# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. Cấu hình Outlook/Hotmail

```env
# Email Configuration (Outlook)
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Cấu hình Yahoo Mail

```env
# Email Configuration (Yahoo)
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Cấu hình SMTP tùy chỉnh

```env
# Email Configuration (Custom SMTP)
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. Test Email Service

Để test xem email có hoạt động không, bạn có thể:

### Cách 1: Sử dụng API endpoint

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Cách 2: Sử dụng giao diện web

1. Mở `http://localhost:3000/login`
2. Nhấn "Quên mật khẩu?"
3. Nhập email và submit
4. Kiểm tra email

## 6. Troubleshooting

### Lỗi thường gặp:

**1. "Invalid login" hoặc "Authentication failed"**

- Kiểm tra email/password có đúng không
- Đối với Gmail: đảm bảo sử dụng App Password, không phải password thường
- Đảm bảo 2FA đã được bật (Gmail)

**2. "Connection timeout"**

- Kiểm tra SMTP_HOST và SMTP_PORT
- Kiểm tra firewall/network

**3. "TLS/SSL errors"**

- Thử đổi SMTP_PORT từ 587 sang 465 hoặc ngược lại
- Cập nhật secure option trong emailService.ts

## 7. Email Templates

Email reset password sử dụng template HTML đẹp với:

- ✅ Responsive design
- ✅ Professional styling
- ✅ Security warnings
- ✅ Branding (Gear Shop)
- ✅ Vietnamese language

Template có thể tùy chỉnh trong `src/lib/emailService.ts`

## 8. Security Notes

- ⚠️ **Không commit SMTP_PASS vào Git**
- ⚠️ Sử dụng App Password thay vì password thường
- ⚠️ Reset token hết hạn sau 15 phút
- ⚠️ Token chỉ sử dụng được 1 lần

## 9. Production Deployment

Khi deploy production:

1. Cập nhật `NEXT_PUBLIC_APP_URL` thành domain thật
2. Sử dụng email domain chính thức
3. Cập nhật thông tin contact trong email template
4. Cân nhắc sử dụng email service chuyên nghiệp (SendGrid, AWS SES, etc.)

## 10. Alternative Email Services

Thay vì SMTP, bạn có thể sử dụng:

- **SendGrid**: Dễ setup, có free tier
- **AWS SES**: Rẻ, scalable
- **Mailgun**: Developer-friendly
- **Postmark**: Delivery cao

Để tích hợp, thay thế logic trong `sendEmail()` function.
