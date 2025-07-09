# Hướng dẫn Deploy và Fix lỗi MIDDLEWARE_INVOCATION_FAILED trên Vercel

## 🐛 Vấn đề
Lỗi `500: INTERNAL_SERVER_ERROR` với code `MIDDLEWARE_INVOCATION_FAILED` xảy ra do:

1. **Client-side code được import vào middleware** (đã fix ✅)
2. **Missing environment variables** trên Vercel
3. **Middleware runtime issues**

## 🔧 Giải pháp đã thực hiện

### 1. Tách Constants ra khỏi Client-side Code ✅
- Tạo `src/lib/constants.ts` cho server-side sử dụng
- Update middleware import từ constants thay vì tokenManager
- Fix client/server-side separation

### 2. Cải thiện Error Handling ✅
- Thêm try-catch vào middleware
- Better error logging
- Graceful fallback handling

### 3. Health Check Endpoint ✅
- Tạo `/api/health` để check environment status
- Exclude khỏi middleware matcher

## 🚀 Cách fix trên Vercel

### Bước 1: Thêm Environment Variables
Đi đến Vercel Dashboard → Project Settings → Environment Variables và thêm:

```
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=604800000
JWT_REFRESH_EXPIRATION=604800000
```

### Bước 2: Redeploy
```bash
# Force redeploy
vercel --prod
```

### Bước 3: Kiểm tra Health
Truy cập: `https://your-domain.vercel.app/api/health`

Kết quả mong đợi:
```json
{
  "status": "healthy",
  "hasJwtSecret": true,
  "fallbackSecretUsed": false
}
```

## 🔍 Debug Steps

### 1. Check Vercel Logs
```bash
vercel logs --follow
```

### 2. Test Authentication Flow
Truy cập: `/auth-test` để test toàn bộ authentication flow

### 3. Check Environment
```bash
# Local development
npm run dev

# Check health endpoint
curl http://localhost:3000/api/health
```

## 📋 Vercel Configuration

Thêm vào `vercel.json`:
```json
{
  "env": {
    "JWT_SECRET": "your-jwt-secret-here",
    "JWT_EXPIRATION": "604800000",
    "JWT_REFRESH_EXPIRATION": "604800000"
  }
}
```

## 🆘 Nếu vẫn bị lỗi

1. **Check Vercel Function Logs**: Vercel Dashboard → Functions tab
2. **Clear Vercel Cache**: Redeploy with cache clear
3. **Check Node.js Version**: Ensure compatibility với Vercel
4. **Review Middleware Matcher**: Ensure không conflict với other routes

## 📞 Support

Nếu vẫn gặp issue:
1. Check logs tại `/api/health`
2. Run authentication test tại `/auth-test`
3. Review environment variables trên Vercel dashboard

## ✅ Verification Checklist

- [ ] JWT_SECRET added to Vercel environment variables
- [ ] Health check endpoint returns healthy status
- [ ] Authentication test page works correctly
- [ ] No client-side imports in middleware
- [ ] Proper error handling in place
- [ ] Vercel logs show no errors 