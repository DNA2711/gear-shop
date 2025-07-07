# Hướng dẫn Deploy lên Vercel với Mock VNPay

## 🚀 Tổng quan

Dự án đã được cấu hình để sử dụng **Mock VNPay** ở cả môi trường development và production. Điều này có nghĩa là:

- ✅ Không cần đăng ký VNPay thật
- ✅ Không cần internet để test thanh toán
- ✅ UI giống 95% VNPay thật
- ✅ Hoạt động ổn định trên Vercel

## 📋 Bước 1: Chuẩn bị Deploy

### 1.1. Kiểm tra cấu hình
File `vercel.json` đã được cấu hình:
```json
{
  "env": {
    "NODE_ENV": "production",
    "VNPAY_TMN_CODE": "DEMO", 
    "VNPAY_SECRET_KEY": "DEMO_SECRET"
  }
}
```

### 1.2. Kiểm tra file .env (local)
```bash
VNPAY_TMN_CODE=DEMO
VNPAY_SECRET_KEY=DEMO_SECRET
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🔧 Bước 2: Deploy lên Vercel

### 2.1. Qua Vercel CLI
```bash
# Install Vercel CLI (nếu chưa có)
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# Set up and deploy? [Y/n] Y
# Which scope? [Your account]
# Link to existing project? [y/N] N
# What's your project's name? gear-shop
# In which directory is your code located? ./
```

### 2.2. Qua Vercel Dashboard
1. Đăng nhập: https://vercel.com
2. Import Git Repository
3. Chọn repo của bạn
4. Deploy!

### 2.3. Cấu hình Environment Variables
Trên Vercel Dashboard:

1. **Settings** → **Environment Variables**
2. Thêm các biến:
```
VNPAY_TMN_CODE = DEMO
VNPAY_SECRET_KEY = DEMO_SECRET  
NEXT_PUBLIC_BASE_URL = https://your-app.vercel.app
DB_HOST = your-db-host
DB_USER = your-db-user
DB_PASSWORD = your-db-password
DB_NAME = your-db-name
```

## 🧪 Bước 3: Test trên Production

### 3.1. Kiểm tra Mock VNPay
1. Truy cập: `https://your-app.vercel.app`
2. Thêm sản phẩm vào giỏ hàng
3. Vào trang checkout
4. Chọn thanh toán VNPay
5. Sẽ redirect đến Mock VNPay page
6. Test thanh toán thành công

### 3.2. Kiểm tra logs
```bash
# Xem logs realtime
vercel logs

# Hoặc trên Dashboard → Functions → View Logs
```

Tìm log: `"Using mock VNPay (DEMO mode)"`

## 🔍 Bước 4: Troubleshooting

### Lỗi "Page not found" ở /vnpay/checkout
**Nguyên nhân:** Route không được build đúng

**Giải pháp:**
```bash
# Rebuild và deploy lại
vercel --prod
```

### Lỗi Environment Variables
**Nguyên nhân:** Biến môi trường chưa được set

**Giải pháp:**
1. Vercel Dashboard → Settings → Environment Variables
2. Thêm tất cả biến cần thiết
3. Redeploy

### Mock VNPay không hoạt động
**Kiểm tra console logs:**
```javascript
// Nên thấy:
"Using mock VNPay (DEMO mode)"

// Nếu thấy:
"Generated payment URL" 
// → Có thể đang dùng VNPay thật
```

## 📊 Monitoring

### 4.1. Vercel Analytics
- Bật Analytics trong Dashboard
- Theo dõi page views, performance

### 4.2. Error Tracking
```bash
# View errors
vercel logs --tail
```

## 🎯 Kết quả mong đợi

Sau khi deploy thành công:

### ✅ Development (localhost:3000)
- Mock VNPay hoạt động
- Fast, không cần internet

### ✅ Production (vercel.app)  
- Mock VNPay hoạt động
- Stable, reliable
- Không cần VNPay API keys thật

### 🔄 Payment Flow
1. User chọn VNPay → Mock VNPay page
2. User nhập thông tin giả → OTP page  
3. User nhập OTP → Processing
4. Auto redirect → Success page
5. Order status updated → "paid"

## 🚀 Lệnh hữu ích

```bash
# Deploy production
vercel --prod

# View logs
vercel logs

# View deployments
vercel ls

# View domains
vercel domains

# View environment variables
vercel env ls
```

## 🔗 URLs quan trọng

- **Production:** https://your-app.vercel.app
- **Mock VNPay:** https://your-app.vercel.app/vnpay/checkout
- **Dashboard:** https://vercel.com/dashboard

## 📞 Hỗ trợ

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Issues:** Check GitHub Issues 