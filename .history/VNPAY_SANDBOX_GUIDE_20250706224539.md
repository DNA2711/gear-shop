# Hướng dẫn đăng ký VNPay Sandbox

## 📋 Tổng quan

Để test với VNPay Sandbox thật (thay vì Mock VNPay), bạn cần đăng ký tài khoản developer tại VNPay để lấy thông tin cấu hình.

## 🔐 Bước 1: Đăng ký tài khoản Sandbox

### 1.1. Truy cập trang đăng ký
- **URL chính thức:** https://sandbox.vnpayment.vn/devreg/
- **Hoặc:** https://vnpay.vn/developer

### 1.2. Điền form đăng ký
Cung cấp các thông tin sau:
- **Email:** Email làm việc của bạn
- **Họ và tên:** Tên đầy đủ
- **Số điện thoại:** Số điện thoại liên lạc
- **Công ty/Tổ chức:** Tên công ty hoặc "Cá nhân"
- **Website:** Website công ty (có thể để trống)
- **Mục đích sử dụng:** "Test tích hợp thanh toán online"
- **Loại hình kinh doanh:** Chọn phù hợp với dự án

### 1.3. Xác thực email
- Kiểm tra email và click link xác thực
- Đăng nhập vào tài khoản sandbox

## 📊 Bước 2: Lấy thông tin cấu hình

Sau khi đăng nhập thành công, bạn sẽ thấy dashboard với các thông tin:

### 2.1. Thông tin merchant
- **TMN Code (Mã website):** `VNPAYXXXXXX`
- **Secure Secret (Chuỗi bí mật):** `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### 2.2. Thông tin API
- **Sandbox URL:** `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`
- **API URL:** `https://sandbox.vnpayment.vn/merchant_webapi/api/transaction`

## ⚙️ Bước 3: Cập nhật cấu hình

### 3.1. Cập nhật file .env
```bash
# Thay thế các giá trị DEMO bằng thông tin thật từ VNPay
VNPAY_TMN_CODE=VNP_YOUR_TMN_CODE_HERE
VNPAY_SECRET_KEY=YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3.2. Kiểm tra cấu hình
Sau khi cập nhật .env, restart server:
```bash
npm run dev
```

## 🧪 Bước 4: Test thanh toán

### 4.1. Thông tin thẻ test VNPay Sandbox

#### Thẻ ATM nội địa:
- **Số thẻ:** `9704198526191432198`
- **Tên chủ thẻ:** `NGUYEN VAN A`
- **Ngày phát hành:** `07/15`
- **Mật khẩu:** `123456`

#### Thẻ quốc tế (Visa/Master):
- **Số thẻ:** `4000000000000002`
- **Tên chủ thẻ:** `NGUYEN VAN A`
- **Ngày hết hạn:** `12/25`
- **CVV:** `123`

#### Internet Banking:
- **Tên đăng nhập:** `demo`
- **Mật khẩu:** `123456`

### 4.2. Flow test
1. Thêm sản phẩm vào giỏ hàng
2. Chọn thanh toán VNPay
3. Sẽ redirect đến VNPay Sandbox (URL thật)
4. Chọn phương thức thanh toán
5. Nhập thông tin thẻ test
6. Hoàn tất thanh toán
7. Redirect về success page

## 🔄 So sánh hai chế độ

| Tính năng | Mock VNPay (DEMO) | Sandbox VNPay |
|-----------|-------------------|---------------|
| **Cần internet** | ❌ Không | ✅ Có |
| **Cần đăng ký** | ❌ Không | ✅ Có |
| **UI giống thật** | ✅ 95% | ✅ 100% |
| **Test callback** | ✅ Có | ✅ Có |
| **Speed** | ⚡ Rất nhanh | 🐌 Phụ thuộc mạng |

## 🔧 Chuyển đổi giữa các chế độ

### Sử dụng Mock VNPay (mặc định):
```bash
VNPAY_TMN_CODE=DEMO
VNPAY_SECRET_KEY=DEMO_SECRET
```

### Sử dụng Sandbox thật:
```bash
VNPAY_TMN_CODE=YOUR_REAL_TMN_CODE
VNPAY_SECRET_KEY=YOUR_REAL_SECRET_KEY
```

### Sử dụng Production:
```bash
VNPAY_TMN_CODE=YOUR_PRODUCTION_TMN_CODE
VNPAY_SECRET_KEY=YOUR_PRODUCTION_SECRET_KEY
NODE_ENV=production
```

## 🚨 Troubleshooting

### Lỗi "Không tìm thấy website"
- **Nguyên nhân:** Sai TMN Code hoặc chưa kích hoạt
- **Giải pháp:** Kiểm tra lại TMN Code từ dashboard

### Lỗi "Invalid signature"
- **Nguyên nhân:** Sai Secure Secret
- **Giải pháp:** Copy lại Secret Key từ dashboard

### Lỗi "Order not found"
- **Nguyên nhân:** Callback không hoạt động đúng
- **Giải pháp:** Kiểm tra Return URL trong cấu hình

## 📞 Hỗ trợ VNPay

- **Hotline:** 1900.5555.77
- **Email:** hotrovnpay@vnpay.vn
- **Website:** https://vnpay.vn
- **Docs:** https://sandbox.vnpayment.vn/apis/

## ✅ Kiểm tra hoạt động

Để kiểm tra xem đang dùng chế độ nào, xem console log:
- **Mock mode:** `"Using mock VNPay for development (DEMO mode)"`
- **Sandbox mode:** `"Generated payment URL"` với `vnpayUrl: "https://sandbox.vnpayment.vn"` 