# 📋 GEAR SHOP - HỆ THỐNG TÀI LIỆU KỸ THUẬT TOÀN DIỆN

## 📖 MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc tổng thể](#2-kiến-trúc-tổng-thể)
3. [Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
4. [Database Schema](#4-database-schema)
5. [Authentication](#5-authentication)
6. [API Structure](#6-api-structure)
7. [Frontend Components](#7-frontend-components)
8. [State Management](#8-state-management)
9. [Deployment](#9-deployment)
10. [Key Features](#10-key-features)

---

## 1. TỔNG QUAN HỆ THỐNG

### 🎯 **Mục đích**

Gear Shop là một **E-commerce platform** chuyên bán linh kiện máy tính, PC Gaming và các thiết bị công nghệ.

### 🛠️ **Technology Stack**

```
Frontend:     Next.js 15, React 19, TypeScript, Tailwind CSS
Backend:      Next.js API Routes (Full-stack)
Database:     MySQL (Railway Cloud)
Deployment:   Vercel (Frontend) + Railway (Database)
Auth:         JWT (Custom implementation)
UI Library:   Radix UI, Lucide Icons, React Hot Toast
State:        React Context API
```

### 🌐 **Architecture Pattern**

```
Monolithic Full-Stack (Next.js App Router)
├── Client-Side Rendering (CSR)
├── Server-Side Rendering (SSR)
├── API Routes (Backend)
└── Database Layer
```

---

## 2. KIẾN TRÚC TỔNG THỂ

### 📊 **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     VERCEL      │    │    RAILWAY      │    │   THIRD PARTY   │
│   (Frontend)    │    │   (Database)    │    │   (Services)    │
│  ┌─────────────┐│    │  ┌─────────────┐│    │  ┌─────────────┐│
│  │ Next.js App ││    │  │ MySQL 8.0   ││    │  │ Email SMTP  ││
│  │  - Pages    ││◄──►│  │  - Tables   ││    │  │ - Nodemailer││
│  │  - API      ││    │  │  - Indexes  ││    │  │ - Gmail     ││
│  │  - Components││   │  │  - Relations││    │  └─────────────┘│
│  └─────────────┘│    │  └─────────────┘│    └─────────────────┘
└─────────────────┘    └─────────────────┘
```

### 🔄 **Request Flow**

```
User → Vercel CDN → Next.js App → API Route → Database (Railway) → Response
```

---

## 3. CẤU TRÚC THƯ MỤC

### 📁 **Root Directory**

```
gear-shop/
├── 📁 src/                     # Source code chính
│   ├── 📁 app/                 # Next.js App Router
│   ├── 📁 components/          # React Components
│   ├── 📁 contexts/            # Context Providers
│   ├── 📁 hooks/               # Custom Hooks
│   ├── 📁 lib/                 # Utility Libraries
│   ├── 📁 types/               # TypeScript Definitions
│   └── 📁 utils/               # Helper Functions
├── 📁 public/                  # Static Assets
├── 📁 database/                # Database Scripts
├── 📄 .env                     # Environment Variables
├── 📄 package.json             # Dependencies
└── 📄 vercel.json              # Vercel Config
```

### 📂 **App Router Structure**

```
src/app/
├── 📁 (main)/                  # Route Group
├── 📁 admin/                   # Admin Dashboard
│   ├── 📄 page.tsx             # Dashboard
│   ├── 📁 products/            # Product management
│   ├── 📁 orders/              # Order management
│   └── 📁 analytics/           # Reports
├── 📁 api/                     # Backend API Routes
│   ├── 📁 auth/                # Authentication
│   ├── 📁 products/            # Product CRUD
│   ├── 📁 orders/              # Order management
│   └── 📁 admin/               # Admin endpoints
├── 📁 products/                # Product pages
├── 📁 cart/                    # Shopping cart
├── 📁 checkout/                # Checkout process
├── 📁 profile/                 # User profile
└── 📄 page.tsx                 # Homepage
```

---

## 4. DATABASE SCHEMA

### 🗃️ **Core Tables**

#### **Users Table**

```sql
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `role` enum('ADMIN','USER') DEFAULT 'USER',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
);
```

#### **Products Table**

```sql
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `product_code` varchar(100) NOT NULL,
  `brand_id` int DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `original_price` decimal(15,2) DEFAULT NULL,
  `stock_quantity` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_code` (`product_code`)
);
```

### 🔗 **Relationships**

```
Users (1) ──────── (N) Orders
Orders (1) ─────── (N) Order_Items
Products (1) ───── (N) Order_Items
Products (N) ───── (1) Categories
Products (N) ───── (1) Brands
```

---

## 5. AUTHENTICATION

### 🔐 **JWT Authentication Flow**

#### **Login Process**

```
1. User submits credentials (email/password)
2. API validates user in database
3. Password verification using bcryptjs
4. Generate JWT token pair (access + refresh)
5. Return tokens to client
6. Store tokens in localStorage + cookies
7. Include token in subsequent requests
```

#### **Token Structure**

```typescript
interface JWTPayload {
  sub: string; // User email
  roles: string[]; // ['USER'] or ['ADMIN']
  iat: number; // Issued at
  exp: number; // Expiration
}
```

#### **Route Protection**

```typescript
// Protected Routes
const protectedRoutes = ["/dashboard", "/profile", "/admin"];
const adminRoutes = ["/admin", "/api/admin"];

// Middleware Authentication
export async function middleware(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const isAuthenticated = await verifyToken(token);
  // Route protection logic
}
```

---

## 6. API STRUCTURE

### 🌐 **API Endpoints**

#### **Authentication**

```
POST   /api/auth/login           # User login
POST   /api/auth/register        # User registration
GET    /api/auth/me              # Get current user
POST   /api/auth/refresh         # Refresh token
POST   /api/auth/forgot-password # Password reset
```

#### **Products**

```
GET    /api/products             # Get products with filters
POST   /api/products             # Create product (Admin)
GET    /api/products/[id]        # Get product by ID
PUT    /api/products/[id]        # Update product (Admin)
DELETE /api/products/[id]        # Delete product (Admin)
```

#### **Orders**

```
GET    /api/orders               # Get user orders
POST   /api/orders               # Create new order
GET    /api/orders/[id]          # Get order details
PUT    /api/orders/[id]/status   # Update status (Admin)
```

### 📝 **Response Format**

```typescript
// Success Response
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: PaginationInfo;
}

// Error Response
interface ErrorResponse {
  success: false;
  status: number;
  message: string;
  errors?: string[];
}
```

---

## 7. FRONTEND COMPONENTS

### 🧱 **Component Architecture**

#### **Layout Structure**

```typescript
<RootLayout>
  <ErrorBoundary>
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <CartProvider>
            <LoadingProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </LoadingProvider>
          </CartProvider>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  </ErrorBoundary>
</RootLayout>
```

#### **Key Components**

```
📦 components/
├── 📁 admin/           # Admin components
│   ├── DashboardStats.tsx
│   ├── ProductModal.tsx
│   └── SalesChart.tsx
├── 📁 auth/            # Authentication
│   └── ProtectedRoute.tsx
├── 📁 cart/            # Shopping cart
│   ├── CartDrawer.tsx
│   └── AddToCartButton.tsx
├── 📁 layout/          # Layout components
│   ├── header.tsx
│   └── footer.tsx
└── 📁 ui/              # Reusable UI
    ├── button.tsx
    ├── ProductCard.tsx
    └── Loading.tsx
```

---

## 8. STATE MANAGEMENT

### 🔄 **Context Providers**

#### **Authentication Context**

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginForm) => Promise<{ success: boolean }>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

#### **Cart Context**

```typescript
interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}
```

#### **Notification Context**

```typescript
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}
```

---

## 9. DEPLOYMENT

### 🚀 **Environment Configuration**

#### **Local Development**

```bash
# .env
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=29150
DB_USER=root
DB_PASSWORD=RTbPDjFprveDAFWcKaIjOpiFimetgWdR
DB_NAME=railway
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### **Production (Vercel)**

```bash
# .env.production
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=29150
DB_USER=root
DB_PASSWORD=RTbPDjFprveDAFWcKaIjOpiFimetgWdR
DB_NAME=railway
JWT_SECRET=production-secret
NEXT_PUBLIC_APP_URL=https://gear-shop.vercel.app
NODE_ENV=production
```

#### **Database Connection**

```typescript
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Serverless optimizations
  connectionLimit: process.env.NODE_ENV === "production" ? 2 : 10,
  idleTimeout: 30000,
  charset: "utf8mb4",
};
```

---

## 10. KEY FEATURES

### 🛒 **E-commerce Features**

#### **Product Management**

- ✅ Product CRUD operations
- ✅ Category hierarchy management
- ✅ Brand management
- ✅ Multiple product images (Base64)
- ✅ Product specifications
- ✅ Inventory tracking
- ✅ Price management
- ✅ Search & filtering

#### **Shopping Cart**

- ✅ Add/remove products
- ✅ Quantity management
- ✅ Persistent cart (localStorage)
- ✅ Real-time price calculation
- ✅ Stock validation

#### **Order Management**

- ✅ Order creation & tracking
- ✅ Status workflow (pending → delivered)
- ✅ Payment methods (COD, VNPay)
- ✅ Order history
- ✅ Admin order management

#### **User Management**

- ✅ Registration & authentication
- ✅ Profile management
- ✅ Role-based access (USER, ADMIN)
- ✅ Password reset

### 📊 **Admin Features**

- ✅ Dashboard with statistics
- ✅ Product management interface
- ✅ Order management
- ✅ User management
- ✅ Analytics & reports

### 🔔 **Advanced Features**

- ✅ Real-time notifications
- ✅ Smart search suggestions
- ✅ Email notifications (SMTP)
- ✅ Responsive design
- ✅ Vietnamese language support

---

## 🔒 SECURITY

### **Security Measures**

- 🔐 JWT authentication with short expiration
- 🔐 bcryptjs password hashing
- 🔐 SQL injection prevention (prepared statements)
- 🔐 Input validation on all endpoints
- 🔐 Role-based access control
- 🔐 Secure error handling

---

## 📈 DATA FLOW EXAMPLES

### **User Login Flow**

```
User Input → Validation → API Call → Database Check → JWT Generation → Context Update → UI Redirect
```

### **Add to Cart Flow**

```
Product Page → Add Button → Stock Check → Cart Context → localStorage → UI Update
```

### **Order Creation Flow**

```
Cart Review → Checkout Form → API Call → Database Transaction → Email Notification → Success Page
```

---

**📞 Technical Contact**: Gear Shop Development Team  
**📅 Last Updated**: January 2025  
**🔗 Repository**: gear-shop
